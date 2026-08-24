export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const validateLogin = ({ email, password }) => {
  const errors = {}
  if (!email) errors.email = 'Email is required.'
  else if (!emailPattern.test(email)) errors.email = 'Enter a valid email address.'
  if (!password) errors.password = 'Password is required.'
  return errors
}

export const validateRegister = ({ fullName, email, phone, password, confirmPassword, terms }) => {
  const errors = {}
  if (!fullName.trim() || fullName.trim().length < 3) errors.fullName = 'Enter your full name.'
  if (!emailPattern.test(email)) errors.email = 'Enter a valid email address.'
  if (!/^07\d{8}$/.test(phone.replace(/\s/g, ''))) errors.phone = 'Use a Jordanian mobile number such as 0790000000.'
  if (password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password)) errors.password = 'Use 8+ characters with an uppercase letter and a number.'
  if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match.'
  if (!terms) errors.terms = 'You must accept the terms.'
  return errors
}

export const validateCheckout = ({ name, phone, address, city, payment }) => {
  const errors = {}
  if (!name.trim()) errors.name = 'Name is required.'
  if (!/^07\d{8}$/.test(phone.replace(/\s/g, ''))) errors.phone = 'Enter a valid mobile number.'
  if (address.trim().length < 8) errors.address = 'Enter a complete delivery address.'
  if (!city) errors.city = 'Select a city.'
  if (!payment) errors.payment = 'Choose a payment method.'
  return errors
}

export const validateProduct = ({ name, category, price, stockQuantity, image }) => {
  const errors = {}
  if (!name.trim()) errors.name = 'Product name is required.'
  if (!category) errors.category = 'Choose a category.'
  if (Number(price) <= 0) errors.price = 'Price must be greater than zero.'
  if (!Number.isInteger(Number(stockQuantity)) || Number(stockQuantity) < 0) errors.stockQuantity = 'Stock must be a whole number of 0 or more.'
  if (!image.trim()) errors.image = 'Image path is required.'
  return errors
}
