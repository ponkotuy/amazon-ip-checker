$(document).ready ->
  new Vue
    el: '#ip'
    data:
      address: ''
      region: ''
      service: ''
    methods:
      submit: ->
        fetch('https://ip-ranges.amazonaws.com/ip-ranges.json')
          .then (res) -> res.json()
          .then (json) => @search(json)
      search: (json) ->
        result = _.find json.prefixes, (p) =>
          ipMatch(p.ip_prefix, @address)
        if result
          @region = result.region
          @service = result.service
        else
          @region = 'Not match'
          @service = 'Not match'

ipMatch = (prefix, ip) ->
  [prefixIp, pre] = prefix.split('/')
  shift = 32 - parseInt(pre)
  pNum = ipToNumber(prefixIp)
  ipNum = ipToNumber(ip)
  (pNum >> shift) == (ipNum >> shift)

ipToNumber = (ip) ->
  xs = ip.split('.')
  _.reduce xs, (memo, x) ->
    memo * 256 + parseInt(x)
