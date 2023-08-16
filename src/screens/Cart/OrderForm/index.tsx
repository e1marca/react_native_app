import { observer } from "mobx-react-lite";
import React, { useCallback, useEffect, useState } from "react";
import { Modal, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { useRootStore } from "src/hooks/useRootStore";
import { FontFamily, MyAppText } from "src/shared/Widgets/MyAppText";
import { useFormatPrice } from "src/hooks/useFormatPrice";
import { useFetch } from "src/hooks/useFetch";
import WebView, { WebViewNavigation } from "react-native-webview";
import { LoadingIndicator } from "src/shared/Widgets/LoadingIndicator";
import { CommonActions, useNavigation } from "@react-navigation/core";
import { AppScreen, AppStackParamList } from "src/screens/types";
import { StackNavigationProp } from "@react-navigation/stack";
import { AlertModal } from "src/shared/Modals/AlertModal";
import { toMajorCurrencyUnit } from "src/helpers/functions";
import { useFormatBonus } from "src/hooks/useFormatBonus";

enum PaymentStatus {
  success = "success",
  failed = "failed",
}

export const OrderForm = observer(() => {
  const [messageAfterMakeOrder, setMessageAfterMakeOrder] = useState("");
  const {
    orderStore: {
      order,
      setFieldsToUpdateOrder,
      applyPromoCode,
      payOrder,
      fieldsToUpdateOrder,
      linkForPay,
      setLinkForPay,
      makeOrder,
    },
    authStore: {
      mobileToken: {
        client_info: { bonuses },
        company_info: { is_promocodes, is_bonus_avaliable },
      },
      getOrUpdateToken,
    },
  } = useRootStore();
  const navigation = useNavigation<StackNavigationProp<AppStackParamList>>();
  const { invokeApi: invokePayOrder, isLoading: isLoadingPayOrder } = useFetch(payOrder);
  const { invokeApi: invokeMakeOrder, isLoading: isLoadingMakeOrder } = useFetch(makeOrder);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const { invokeApi: invokeGetOrUpdateToken, isLoading } = useFetch(getOrUpdateToken);

  const handleCloseModal = () => {
    setMessageAfterMakeOrder("");
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: AppScreen.Main }],
      })
    );
  };

  const isOnlinePayment = useCallback(() => {
    const pay = order?.pay_types?.filter(pt => pt[0] === fieldsToUpdateOrder.pay_type_id)[0];
    return pay && pay[1] === "Картой онлайн";
  }, [fieldsToUpdateOrder, order.pay_types]);

  const handleMakeOrder = () => {
    invokeMakeOrder().then(m => {
      setMessageAfterMakeOrder(m);
    });
  };

  useEffect(() => {
    !!order?.pay_types?.length && setFieldsToUpdateOrder({ pay_type_id: order.pay_types[0][0] });
  }, []);

  const handleCancelPromocode = () => {
    setFieldsToUpdateOrder({ promo_code_text: "" });
    applyPromoCode();
  };

  const handleNavigationChange = (navState: WebViewNavigation) => {
    const url = navState.url;

    if (/success_card/.test(url)) {
      setPaymentStatus(PaymentStatus.success);
      invokeGetOrUpdateToken();
    } else if (/faild_card/.test(url)) {
      setPaymentStatus(PaymentStatus.failed);
    }
  };
  const handleClosePaymentModal = () => {
    if (paymentStatus === PaymentStatus.success) {
      setMessageAfterMakeOrder("Спасибо за ваш заказ");
    } else {
      setLinkForPay("");
    }
  };
  return (
    <>
      <AlertModal title={messageAfterMakeOrder} visible={!!messageAfterMakeOrder} handleConfirm={handleCloseModal} />
      {(isLoadingPayOrder || isLoadingMakeOrder) && (
        <View style={s.loadingOverlay}>
          <LoadingIndicator />
        </View>
      )}
      <ScrollView style={s.scrollView}>
        <View style={s.whiteRoundBox}>
          <View style={s.totalTitle}>
            <MyAppText style={s.totalTitleText}>{`Итого: ${useFormatPrice(order.pay_sum)}`}</MyAppText>
          </View>
          {!!order.bonus_sum && (
            <View style={s.bonusBox}>
              <MyAppText style={s.bonusBoxText}>
                {`Оплата бонусами: ${useFormatBonus({ bonuses: order.bonus_sum, displayPrefix: false })}`}
              </MyAppText>
              <TouchableOpacity onPress={() => setFieldsToUpdateOrder({ bonus_sum: 0 })}>
                <MyAppText style={s.bonusBoxButton}>Отменить бонусы</MyAppText>
              </TouchableOpacity>
            </View>
          )}
          {!!order.promo_sum && (
            <View style={s.bonusBox}>
              <MyAppText style={s.bonusBoxText}>{`Промокод: ${order.promo_code_text}`}</MyAppText>
              <TouchableOpacity onPress={handleCancelPromocode}>
                <MyAppText style={s.bonusBoxButton}>Отменить промокод</MyAppText>
              </TouchableOpacity>
            </View>
          )}
        </View>
        {!order.promo_sum && is_promocodes && (
          <View style={s.bonusSectionWrapper}>
            <TextInput
              placeholder="Промокод"
              style={s.promoCodeTextInput}
              onChangeText={t => setFieldsToUpdateOrder({ promo_code_text: t })}
            />
            <TouchableOpacity onPress={applyPromoCode} style={s.button}>
              <MyAppText style={s.buttonText}>Применить</MyAppText>
            </TouchableOpacity>
          </View>
        )}
        {!!order.maximum_bonus_spend && !order.bonus_sum && is_bonus_avaliable && (
          <View style={s.bonusSectionWrapper}>
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
              <MyAppText style={s.myBonusText}>Мои бонусы:</MyAppText>
              <MyAppText style={s.myBonusSum}>{toMajorCurrencyUnit(bonuses)}</MyAppText>
            </View>
            {bonuses === 0 ? (
              <MyAppText style={s.noBonusMessage}>У вас нет доступных бонусов для списания</MyAppText>
            ) : (
              <View>
                <TouchableOpacity
                  onPress={() => setFieldsToUpdateOrder({ bonus_sum: order.maximum_bonus_spend })}
                  style={s.applyBonusBtn}>
                  <MyAppText style={s.btnText}>Списать бонусы</MyAppText>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        <View style={s.paymentMethodSection}>
          <MyAppText style={s.paymentMethodTitle}>Способ оплаты</MyAppText>
          {order.pay_types?.map(pt => (
            <TouchableOpacity
              key={pt[0]}
              style={s.paymentMethodItem}
              onPress={() => setFieldsToUpdateOrder({ pay_type_id: pt[0] })}>
              <View style={s.paymentMethodButtonOuter}>
                <View
                  style={[
                    s.paymentMethodButtonInner,
                    fieldsToUpdateOrder.pay_type_id === pt[0] && s.paymentMethodButtonInnerSelected,
                  ]}
                />
              </View>
              <MyAppText style={s.paymentMethodText}>{pt[1]}</MyAppText>
            </TouchableOpacity>
          ))}
        </View>
        <Modal style={s.modalContainer} animationType="fade" transparent={true} visible={!!linkForPay}>
          <View style={s.modalContainer}>
            <View style={s.webViewSection}>
              <WebView source={{ uri: linkForPay }} onNavigationStateChange={handleNavigationChange} />
            </View>
            <View style={s.cancelSection}>
              <TouchableOpacity onPress={handleClosePaymentModal} style={s.btnWrapper}>
                <MyAppText style={s.btnText}>
                  {paymentStatus === PaymentStatus.success ? "Готово" : "Отменить"}
                </MyAppText>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View style={{ paddingBottom: 20 }}>
          {isOnlinePayment() ? (
            <TouchableOpacity onPress={invokePayOrder} style={s.btnWrapper}>
              <MyAppText style={s.btnText}>Оплатить</MyAppText>
            </TouchableOpacity>
          ) : (
            fieldsToUpdateOrder.pay_type_id && (
              <TouchableOpacity onPress={handleMakeOrder} style={s.btnWrapper}>
                <MyAppText style={s.btnText}>Оформить заказ</MyAppText>
              </TouchableOpacity>
            )
          )}
        </View>
      </ScrollView>
    </>
  );
});

const s = StyleSheet.create({
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  scrollView: {
    padding: 10,
  },
  whiteRoundBox: {
    borderRadius: 10,
    backgroundColor: "#FFF",
    marginBottom: 10,
    padding: 20,
  },
  totalTitle: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#C5C5C5",
  },
  totalTitleText: {
    fontFamily: FontFamily.BOLD,
    fontSize: 18,
    fontWeight: "700",
  },
  promoCodeTextInput: {
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: "#DEDEDE",
  },
  button: {
    backgroundColor: "#10BBFF",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    margin: 10,
    marginBottom: 0,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: FontFamily.SEMIBOLD,
  },
  bonusSectionWrapper: { borderRadius: 10, backgroundColor: "#FFF", marginBottom: 10, padding: 20 },
  myBonusText: {
    fontSize: 16,
    fontWeight: "400",
  },
  myBonusSum: { fontSize: 18, fontWeight: "600", color: "#333333", fontFamily: FontFamily.BOLD, marginLeft: 5 },
  noBonusMessage: {
    fontSize: 16,
    fontWeight: "400",
    color: "#919191",
    fontFamily: FontFamily.SEMIBOLD,
    textAlign: "center",
    marginTop: 10,
  },
  bonusTextInput: {
    fontSize: 16,
    color: "#333",
    padding: 10,
  },
  applyBonusBtn: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    margin: 10,
    marginBottom: 0,
    borderRadius: 10,
    backgroundColor: "#10BBFF",
    marginTop: 20,
  },
  paymentMethodSection: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#FFF",
  },
  paymentMethodTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  paymentMethodItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  paymentMethodButtonOuter: {
    justifyContent: "center",
    alignItems: "center",
    padding: 3,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#10BBFF",
    marginRight: 10,
  },
  paymentMethodButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 100,
    backgroundColor: "#FFF",
  },
  paymentMethodButtonInnerSelected: {
    backgroundColor: "#10BBFF",
  },
  paymentMethodText: {
    fontSize: 16,
    fontWeight: "400",
    textAlignVertical: "center",
  },
  modalContainer: {
    flex: 1,
  },
  webViewSection: {
    flex: 7,
  },
  cancelSection: {
    flex: 1,
    backgroundColor: "#FFF",
    justifyContent: "center",
  },
  btnWrapper: {
    backgroundColor: "#F9BE28",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    margin: 10,
    marginBottom: 0,
    borderRadius: 10,
  },
  btnText: { fontSize: 18, fontWeight: "600", color: "#FFFFFF", fontFamily: FontFamily.SEMIBOLD },
  bonusBox: {
    backgroundColor: "#F4F4F4",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
  },
  bonusBoxText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
  },
  bonusBoxButton: {
    fontSize: 16,
    fontWeight: "500",
    color: "#10BBFF",
  },
});
