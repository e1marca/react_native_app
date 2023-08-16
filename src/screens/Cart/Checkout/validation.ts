import * as yup from "yup";

export const validationSchema = yup.object().shape({
  fio: yup.string().required("ФИО обязательно для заполнения").min(1, "Поле ФИО пустое"),
  comment: yup.string().max(50, "Комментарий слишком длинный!"),
});
