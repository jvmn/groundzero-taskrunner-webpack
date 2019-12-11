module.exports = (message, exit) => {
  console.error(message)
  if (exit) {
    process.exit(1)
    throw new Error(message)
  }
}