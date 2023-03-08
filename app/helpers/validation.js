exports.validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const emailDomain = email.split('@')[1]
  const isStudentEmail = emailDomain === 'student.com'
  return emailRegex.test(email) && isStudentEmail
}

exports.validatePassword = (password) => {
  // minimal 8 karakter, minimal satu huruf kapital, satu huruf kecil, satu angka, dan satu karakter khusus
  const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/;
  return re.test(password);
}