const paypal = require("paypal-rest-sdk");

// paypal integration
var client_id =
  "AWnbpHeILgpy2_eppHn9b3crSnmwDX8zcbNMs55w3oI2_CVtFmMMP78EzwojAiygcHfbVGLWhPkM24PV";
var secret =
  "ENdMoebOgiTpASBuac8sEWR32drjl5_7NsNQRFlH8j9zhFvoiJjicPVQD9S4bCchmW9-hOkEB991GYcQ";

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id: client_id,
  client_secret: secret,
});

exports.checkout = function (req, res, next) {
  var payReq = JSON.stringify({
    intent: "sale",
    redirect_urls: {
      return_url: "http://localhost:3000/process",
      cancel_url: "http://localhost:3000/cancel",
    },
    payer: {
      payment_method: "paypal",
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: "Red Sox Hat",
              sku: "001",
              price: "25.00",
              currency: "USD",
              quantity: 1,
            },
          ],
        },
        amount: {
          total: "25.00",
          currency: "USD",
        },
        description: "This is the payment transaction description.",
      },
    ],
  });

  paypal.payment.create(payReq, function (error, payment) {
    if (error) {
      console.error(error);
    } else {
      //capture HATEOAS links
      var links = {};
      payment.links.forEach(function (linkObj) {
        links[linkObj.rel] = {
          href: linkObj.href,
          method: linkObj.method,
        };
      });

      //if redirect url present, redirect user
      if (links.hasOwnProperty("approval_url")) {
        res.redirect(links["approval_url"].href);
      } else {
        console.error("no redirect URI present");
      }
    }
  });
};
