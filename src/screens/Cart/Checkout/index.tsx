import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Animated, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { useFetch } from "src/hooks/useFetch";
import { useRootStore } from "src/hooks/useRootStore";
import { FontFamily, MyAppText } from "src/shared/Widgets/MyAppText";
import { DeliveryType } from "src/stores/orderStore/types";
import { Calendar } from "react-native-calendars";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import { CartScreens, CartStackParamList } from "../types";
import { ProfileScreens } from "src/screens/Profile/types";
import { AppScreen } from "src/screens/types";
import { DeliveryButton } from "./DeliveryButton";
import { LoadingIndicator } from "src/shared/Widgets/LoadingIndicator";
import { RadioButton } from "src/shared/Widgets/RadioButton";
import { MobileDeliveryType } from "src/stores/authStore/types";
import { DeliveryMethod } from "./DeliveryMethod";
import { MyIcon } from "src/shared/Widgets/MyIcon";
import useNavigateAndSaveScreen from "src/hooks/useNavigateAndSaveScreen";
import { BottomModalWrapper } from "src/shared/Modals/BottomModalWrapper";
import { validationSchema } from "./validation";
import * as yup from "yup";

interface FieldsData {
  fio?: string;
  comment?: string;
}

export const Checkout = observer(() => {
  const {
    orderStore: {
      order,
      convertCartToOrder,
      orderDatePeriod,
      setFieldsToUpdateOrder,
      fieldsToUpdateOrder,
      updateMinDateForOrder,
      minDateForOrder,
    },
    addressStore: { getAddresses, addresses },
    authStore: { mobileDeliveryType, pickupPoints, userFullName },
  } = useRootStore();
  const [calendarVisible, setCalendarVisible] = useState(false);
  const { invokeApi: invokeConvertCartToOrder, isLoading: isLoadingConvertCartToOrder } = useFetch(convertCartToOrder);
  const { invokeApi: invokeGetAddresses, isLoading: isLoadingGetAddresses } = useFetch(getAddresses);
  const { invokeApi: invokeUpdateMinDate } = useFetch(updateMinDateForOrder);
  const route = useRoute<RouteProp<CartStackParamList, CartScreens.CHECKOUT>>();
  const {
    params: { addressAdded },
  } = route;
  const [errors, setErrors] = useState<FieldsData>({} as FieldsData);
  const navigateAndSaveScreen = useNavigateAndSaveScreen();
  const [fadeIn] = useState(new Animated.Value(1));
  const navigation = useNavigation<StackNavigationProp<CartStackParamList>>();

  useEffect(() => {
    invokeConvertCartToOrder();
    invokeGetAddresses();
    setFieldsToUpdateOrder({ fio: userFullName ?? "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (order.address?.id !== fieldsToUpdateOrder.address.id) {
      const dateString = new Date().toDateString();
      invokeUpdateMinDate(order.address?.district_id!, dateString);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldsToUpdateOrder.address.id]);

  const [datePeriodModalVisible, setDatePeriodModalVisible] = useState(false);

  useEffect(() => {
    mobileDeliveryType === MobileDeliveryType.only_delivery &&
      setFieldsToUpdateOrder({ delivery_type: DeliveryType.delivery });
    mobileDeliveryType === MobileDeliveryType.only_pickup &&
      setFieldsToUpdateOrder({ delivery_type: DeliveryType.pickup });
  }, [mobileDeliveryType, setFieldsToUpdateOrder]);

  const updateAddress = (index: number) => {
    if (fieldsToUpdateOrder.delivery_type === DeliveryType.delivery && addresses?.length) {
      setFieldsToUpdateOrder({
        address_id: addresses[index].id,
        address: { id: addresses[index].id },
        delivery_type: DeliveryType.delivery,
      });
    }
  };

  useEffect(() => {
    updateAddress(0);
  }, [addresses]);

  useEffect(() => {
    if (addressAdded && addresses?.length) {
      const index = addresses.length - 1;
      updateAddress(index);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressAdded]);

  useEffect(() => {
    fieldsToUpdateOrder.delivery_type === DeliveryType.pickup &&
      pickupPoints?.length &&
      setFieldsToUpdateOrder({ delivery_pickup_point: pickupPoints[0], delivery_type: DeliveryType.pickup });
  }, [fieldsToUpdateOrder.delivery_type, pickupPoints, setFieldsToUpdateOrder]);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeIn, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fieldsToUpdateOrder.delivery_type, fadeIn]);

  const handleAddAddress = () => {
    const { Cart, Profile } = AppScreen,
      { CHECKOUT } = CartScreens,
      { ADD_ADDRESS } = ProfileScreens;
    navigateAndSaveScreen({
      currentScreen: [Cart, { screen: CHECKOUT, params: { addressAdded: true } }],
      targetScreen: [Profile, { screen: ADD_ADDRESS }],
    });
  };

  const validateFields = async (fields: FieldsData) => {
    try {
      await validationSchema.validate(fields, { abortEarly: false });
      setErrors({} as FieldsData);
      navigation.navigate(CartScreens.ORDER_FORM);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const errorMessages: Partial<FieldsData> = {};
        error.inner.forEach(err => {
          if (err.path) {
            errorMessages[err.path as keyof FieldsData] = err.message;
          }
        });
        setErrors(errorMessages);
      } else {
        console.log(error);
      }
    }
  };
  const handleNextStep = async () => {
    const fieldsData = {
      fio: fieldsToUpdateOrder.fio,
      comment: fieldsToUpdateOrder.comment,
    };

    await validateFields(fieldsData);
  };

  if (isLoadingGetAddresses || isLoadingConvertCartToOrder) {
    return <LoadingIndicator />;
  }
  return (
    <ScrollView>
      <View style={s.wrapper}>
        {mobileDeliveryType === MobileDeliveryType.delivery_and_pickup ? (
          <View>
            <MyAppText style={s.deliveryText}>Доставка</MyAppText>
            <View style={s.deliveryTypeButtons}>
              <DeliveryButton type={DeliveryType.delivery}>На адрес</DeliveryButton>
              <DeliveryButton type={DeliveryType.pickup}>Самовывоз</DeliveryButton>
            </View>
          </View>
        ) : (
          <DeliveryMethod name={mobileDeliveryType!} />
        )}
        {fieldsToUpdateOrder.delivery_type === DeliveryType.delivery ? (
          <Animated.View style={{ opacity: fadeIn, paddingTop: 5 }}>
            {addresses?.length ? (
              addresses?.map(ad => {
                return (
                  <TouchableOpacity
                    key={ad.id}
                    style={s.addressWrapper}
                    onPress={() => {
                      setFieldsToUpdateOrder({
                        address_id: ad.id,
                        address: { id: ad.id },
                        delivery_type: DeliveryType.delivery,
                      });
                    }}>
                    <RadioButton isSelected={fieldsToUpdateOrder.address_id === ad.id} />
                    <MyAppText style={{ fontSize: 16, fontWeight: "400" }}>{ad.map_addr}</MyAppText>
                  </TouchableOpacity>
                );
              })
            ) : (
              <MyAppText style={s.noAddress}>Нет доступных адресов</MyAppText>
            )}
            <View style={{ borderTopWidth: 1, borderTopColor: "#e5e5e5", marginTop: 5 }}>
              <TouchableOpacity style={s.addAddressButton} onPress={handleAddAddress}>
                <MyIcon styles={s.iconStyle} source={require("icons/profileScreen/add.png")} />
                <MyAppText style={s.addAddressText}>Добавить адрес</MyAppText>
              </TouchableOpacity>
            </View>
          </Animated.View>
        ) : (
          <Animated.View style={{ opacity: fadeIn, paddingTop: 5 }}>
            {pickupPoints?.map(p => (
              <TouchableOpacity
                key={p}
                style={{ flexDirection: "row", marginBottom: 10 }}
                onPress={() =>
                  setFieldsToUpdateOrder({ delivery_pickup_point: p, delivery_type: DeliveryType.pickup })
                }>
                <RadioButton isSelected={fieldsToUpdateOrder.delivery_pickup_point === p} />
                <MyAppText style={{ fontSize: 16, fontWeight: "400" }}>{p}</MyAppText>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}
      </View>
      {fieldsToUpdateOrder.address_id && order.delivery_type === DeliveryType.delivery && (
        <Animated.View style={[s.deliveryDateContainer, { opacity: fadeIn }]}>
          <MyAppText style={s.deliveryDate}>Время доставки</MyAppText>
          <MyAppText style={s.dateText}>Дата доставки:</MyAppText>
          <View style={{ borderBottomWidth: 1, borderBottomColor: "#e5e5e5", marginBottom: 10 }}>
            <TouchableOpacity onPress={() => setCalendarVisible(true)} style={s.calendarButton}>
              <MyIcon styles={s.iconStyle} source={require("icons/cartScreen/calendar.png")} />
              <MyAppText style={s.selectDateOrPeriod}>{fieldsToUpdateOrder.date || "Выберите дату"}</MyAppText>
            </TouchableOpacity>
          </View>
          <MyAppText style={s.dateText}>Период доставки:</MyAppText>
          <TouchableOpacity onPress={() => setDatePeriodModalVisible(true)} style={s.datePeriodButton}>
            <MyIcon styles={s.iconStyle} source={require("icons/cartScreen/clock.png")} />
            <MyAppText style={s.selectDateOrPeriod}>
              {fieldsToUpdateOrder.time_from
                ? `${fieldsToUpdateOrder.time_from} - ${fieldsToUpdateOrder.time_to}`
                : "Выберите период"}
            </MyAppText>
          </TouchableOpacity>
        </Animated.View>
      )}
      <Animated.View style={[s.inputsContainer, { opacity: fadeIn }]}>
        <TextInput
          style={[s.fullnameTextInput, !!errors.fio && s.error]}
          placeholder="ФИО"
          value={fieldsToUpdateOrder.fio}
          onChangeText={t => {
            setFieldsToUpdateOrder({ fio: t });
          }}
        />
        <TextInput
          style={[s.commentTextInput, !!errors.comment && s.error]}
          multiline
          numberOfLines={3}
          placeholder="Комментарий"
          value={fieldsToUpdateOrder.comment}
          onChangeText={t => setFieldsToUpdateOrder({ comment: t })}
        />
        <TouchableOpacity onPress={() => handleNextStep()} style={s.nextStepButton}>
          <MyAppText style={s.nextStepButtonText}>Далее</MyAppText>
        </TouchableOpacity>
        <TouchableOpacity style={s.cancelButton} onPress={() => navigation.goBack()}>
          <MyAppText style={s.cancelButtonText}>Отменить</MyAppText>
        </TouchableOpacity>
      </Animated.View>
      <BottomModalWrapper visible={!!fieldsToUpdateOrder.address_id && calendarVisible} setVisible={setCalendarVisible}>
        <Calendar
          firstDay={1}
          minDate={minDateForOrder}
          onDayPress={day => {
            setFieldsToUpdateOrder({ date: day.dateString });
            setCalendarVisible(false);
          }}
          markedDates={{
            [fieldsToUpdateOrder.date]: { selected: true, disableTouchEvent: true },
          }}
        />
      </BottomModalWrapper>
      <BottomModalWrapper
        setVisible={setDatePeriodModalVisible}
        visible={!!fieldsToUpdateOrder.address_id && datePeriodModalVisible}>
        <View style={{ padding: 15 }}>
          <MyAppText style={{ fontSize: 18, fontWeight: "400", marginBottom: 10 }}>Выберите период</MyAppText>
          {orderDatePeriod?.periods?.map(p => (
            <TouchableOpacity
              key={p.id}
              style={{ flexDirection: "row", marginBottom: 5, alignItems: "center" }}
              onPress={() => {
                setFieldsToUpdateOrder({ time_from: p.period[0], time_to: p.period[1] });
                setDatePeriodModalVisible(false);
              }}>
              <RadioButton isSelected={order.time_from === p.period[0] && order.time_to === p.period[1]} />
              <MyAppText style={{ color: "#333333", fontWeight: "400", fontSize: 16 }}>{p.title}</MyAppText>
            </TouchableOpacity>
          ))}
        </View>
      </BottomModalWrapper>
    </ScrollView>
  );
});

const s = StyleSheet.create({
  calendarButton: { flexDirection: "row", marginBottom: 10, alignItems: "center" },
  selectDateOrPeriod: { fontSize: 16, fontWeight: "400", marginLeft: 10 },
  datePeriodButton: { flexDirection: "row", marginBottom: 10, alignItems: "center" },
  deliveryDate: { fontSize: 18, fontWeight: "500", marginBottom: 10 },
  addAddressButton: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  addAddressText: {
    fontSize: 16,
    fontWeight: "400",
    marginLeft: 10,
    color: "#10BBFF",
  },
  noAddress: {
    fontSize: 16,
    fontWeight: "400",
    marginTop: 10,
    color: "#919191",
    textAlign: "center",
  },
  deliveryText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  datePeriodText: {
    fontSize: 16,
    fontWeight: "400",
    fontFamily: FontFamily.REGULAR,
    color: "#333333",
    marginBottom: 5,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "400",
    fontFamily: FontFamily.REGULAR,
    marginBottom: 5,
    color: "#787878",
  },
  wrapper: { margin: 10, padding: 20, borderRadius: 10, backgroundColor: "#FFF" },
  deliveryTypeButtons: { flexDirection: "row", backgroundColor: "#D9D9D9", borderRadius: 10, marginBottom: 10 },
  addressWrapper: { flexDirection: "row", marginBottom: 10, alignItems: "center" },
  commentTextInput: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 10,
    margin: 10,
    fontSize: 16,
    color: "#333333",
    minHeight: 3 * (16 + 8),
    fontWeight: "400",
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#FFF",
  },
  nextStepButton: {
    backgroundColor: "#F9BE28",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  nextStepButtonText: { fontSize: 18, fontWeight: "600", color: "#FFFFFF", fontFamily: FontFamily.SEMIBOLD },
  cancelButton: { justifyContent: "center", alignItems: "center" },
  cancelButtonText: { fontSize: 18, fontWeight: "600", color: "#333333", fontFamily: FontFamily.SEMIBOLD },
  fullnameTextInput: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 10,
    fontSize: 16,
    color: "#333333",
    fontWeight: "400",
    borderWidth: 1,
    borderColor: "#FFF",
  },
  error: {
    borderColor: "#FF3E3E",
  },
  deliveryDateContainer: { padding: 20, margin: 10, backgroundColor: "#FFF", borderRadius: 10 },
  inputsContainer: { marginTop: 10, paddingBottom: 20 },
  iconStyle: {
    width: 20,
    height: 20,
  },
});
