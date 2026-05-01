function detectSuspiciousLogin(currentIP, previousIPs) {
  return !previousIPs.includes(currentIP);
}

module.exports = { detectSuspiciousLogin };