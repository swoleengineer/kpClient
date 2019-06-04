export const getFormProps = (getErr, processField) => (id, icon, placeholder, label) => ({
  formGroup: {
    helperText: getErr(id).message,
    label,
    labelFor: id,
    intent: getErr(id).intent
  },
  inputGroup: {
    leftIcon: getErr(id).message ? 'error' : icon,
    placeholder,
    id,
    intent: getErr(id).intent,
    onBlur: processField
  }
})
