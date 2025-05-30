export const formatDateFull = (date: Date): string => {
  const formatDate = new Date(date)
  const second = String(formatDate.getSeconds()).padStart(2, '0')
  const minute = String(formatDate.getMinutes()).padStart(2, '0')
  const hour = String(formatDate.getHours()).padStart(2, '0')
  const day = String(formatDate.getDate()).padStart(2, '0')
  const month = String(formatDate.getMonth() + 1).padStart(2, '0')
  const year = formatDate.getFullYear()

  return `${hour}:${minute}:${second} ${day}/${month}/${year}`
}
