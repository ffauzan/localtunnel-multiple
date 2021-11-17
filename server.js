const localtunnel = require('localtunnel');

// Your domain & port list
const domains = [
  {
    port: 9000,
    subdomain: "f-port"
  },
  {
    port: 3000,
    subdomain: "f-adguard"
  },
]

let getDomain = async (domain) => {
  const tunnel = await localtunnel(domain)

  if (tunnel.url.includes(domain.subdomain)) {
    console.log(tunnel.url)
  } else {
    console.log('requested subdomain unavailable, replaced by: ' + tunnel.url)
  }
  
  // Restart
  var restartingTunnel = false
  tunnel.on('error', (err) => {
    if (restartingTunnel) return
    console.log(tunnel.url + ' error, retrying')

    restartingTunnel = true
    getDomain(domain)
  })
}

domains.forEach((domain) => {
  getDomain(domain)
})