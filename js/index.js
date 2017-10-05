(function() {
  var ipMatch, ipToNumber;

  $(document).ready(function() {
    return new Vue({
      el: '#ip',
      data: {
        address: '',
        region: '',
        service: ''
      },
      methods: {
        submit: function() {
          return fetch('https://ip-ranges.amazonaws.com/ip-ranges.json').then(function(res) {
            return res.json();
          }).then((function(_this) {
            return function(json) {
              return _this.search(json);
            };
          })(this));
        },
        search: function(json) {
          var result;
          result = _.find(json.prefixes, (function(_this) {
            return function(p) {
              return ipMatch(p.ip_prefix, _this.address);
            };
          })(this));
          if (result) {
            this.region = result.region;
            return this.service = result.service;
          } else {
            this.region = 'Not match';
            return this.service = 'Not match';
          }
        }
      }
    });
  });

  ipMatch = function(prefix, ip) {
    var ipNum, pNum, pre, prefixIp, ref, shift;
    ref = prefix.split('/'), prefixIp = ref[0], pre = ref[1];
    shift = 32 - parseInt(pre);
    pNum = ipToNumber(prefixIp);
    ipNum = ipToNumber(ip);
    return (pNum >> shift) === (ipNum >> shift);
  };

  ipToNumber = function(ip) {
    var xs;
    xs = ip.split('.');
    return _.reduce(xs, function(memo, x) {
      return memo * 256 + parseInt(x);
    });
  };

}).call(this);
