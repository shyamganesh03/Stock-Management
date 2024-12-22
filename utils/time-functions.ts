export function getCurrentTimestamp() {
  const now = new Date()
  const year = now.getFullYear()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const seconds = now.getSeconds().toString().padStart(2, '0')
  const milliseconds = now.getMilliseconds().toString().padStart(3, '0')

  // Create a microsecond format by padding the milliseconds to 6 digits
  const microseconds = (milliseconds + '000').slice(0, 6) // Adding trailing zeros to make 6 digits

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${microseconds}`
}
