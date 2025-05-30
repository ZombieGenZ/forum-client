export const isValidVietnameseLocalPhoneNumber = (phoneNumber: string) => {
  const phoneRegex = /^0[3|5|7|8|9][0-9]{8}$/
  const cleanedPhoneNumber = phoneNumber.replace(/[\s-]/g, '')
  return phoneRegex.test(cleanedPhoneNumber)
}
