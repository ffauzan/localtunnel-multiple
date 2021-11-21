const localtunnel = require('localtunnel')
const fs = require('fs')
const YAML = require('yaml')

// Your domain & port list
let rawData = fs.readFileSync('domains.yaml', 'utf-8')
let domains = YAML.parse(rawData)

let getDomain = async (domain, t) => {
  const tunnel = await localtunnel(domain)

  // Delay between each tunnel request
  await require('timers/promises').setTimeout(t * 5000)

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

domains.forEach((domain, i) => {
  getDomain(domain, i + 1)
})