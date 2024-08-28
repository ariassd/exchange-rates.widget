export const Config = {
  show: ["coopenae", "mutual", "coopealianza" ,"bccr","bcr", "bct", "bac" ],
  defaultBrowser: "open -a Google\\ Chrome.app",
  banks: [
    {
      name: "bccr",
      shortName: "bccr",
      bankCode: 100,
      pict: "/exchange-rates.widget/assets/bccr.png",
      url: "https://www.bccr.fi.cr/SitePages/Inicio.aspx",
      web: "https://www.bccr.fi.cr/SitePages/Inicio.aspx",
      isHtml: true,
      transformation: {
        buyRate: (data) => {
          const buy = data.getElementById("D317").innerHTML.replace(/,/ig, '.').replace(/₡|\s/ig, '');
          return +buy
        },
        sellRate: (data) => {
          const sell = data.getElementById("D318").innerHTML.replace(/,/ig, '.').replace(/₡|\s/ig, '');
          return +sell
        },
        date: (data) => new Date(),
      },
    },
    {
      name: "coopenae",
      shortName: "cn",
      bankCode: 814,
      pict: "/exchange-rates.widget/assets/coopenae.png",
      url: "https://www.vista360coopenae.fi.cr/TreasuryAPI/api/ExchangeRate?operatorCode=0&countryCode=CR&channelCode=WB&currencyCode=COL&type=1",
      web: "https://www.coopenaevirtual.fi.cr/Coopenae",
      transformation: {
        buyRate: (data) => +data.buyRate,
        sellRate: (data) => +data.sellRate,
        date: (data) => new Date(),
      },
    },
    {
      name: "mutual",
      shortName: "mut",
      bankCode: 814,
      pict: "/exchange-rates.widget/assets/mutual.png",
      url: "https://www2.gmapi.fi.cr/currency-exchange/currency-exchange-transaction-origination/",
      web: "https://mutualenlinea.grupomutual.fi.cr/ingreso",
      transformation: {
        buyRate: (data) => +data.exchangeRateItem.ratePurchase,
        sellRate: (data) => +data.exchangeRateItem.rateSale,
        date: (data) => new Date(),
      },
    },
    {
      name: "coopealianza",
      shortName: "mut",
      bankCode: 814,
      pict: "/exchange-rates.widget/assets/coopealianza.png",
      url: "https://coopealianza.fi.cr/tipo-cambio/consulta_tc.php",
      web: "https://web.coopealianza.fi.cr/Administration.WebUI/Pages/General/Login.aspx",
      method: "post",
      transformation: {
        buyRate: (data) => +data.tc_compra,
        sellRate: (data) => +data.tc_venta,
        date: (data) => new Date(),
      },
    },
    {
      name: "bcr",
      shortName: "bcr",
      bankCode: 152,
      pict: "/exchange-rates.widget/assets/bcr.png",
      url: "https://www.bancobcr.com/wps/proxy/http/bcrrestgen-app:24000/rest/api/v1/bcr-informativo/tipo-cambio/obtener/dolares",
      web: "https://www.personas.bancobcr.com/plantilla/index.asp",
      transformation: {
        buyRate: (data) => +data.compra.substring(0, 6),
        sellRate: (data) => +data.venta.substring(0, 6),
        date: (data) => new Date(),
      },
    },
    {
      name: "bct",
      shortName: "bct",
      bankCode: 107,
      pict: "/exchange-rates.widget/assets/bct.png",
      url: "https://app001.corporacionbct.com/Tailored.ICBanking.WebApi/api/framework/common/exchangeRates",
      web: "https://www.enlacebct.com",
      transformation: {
        buyRate: (data) => +data[0].buyRate,
        sellRate: (data) => +data[0].sellRate,
        date: (data) => new Date(),
      },
    },
    {
      name: "bac",
      shortName: "bac",
      bankCode: 102,
      pict: "/exchange-rates.widget/assets/bac.png",
      url: "https://www.sucursalelectronica.com/exchangerate/showXmlExchangeRate.do",
      web: "https://www.sucursalelectronica.com/redir/showLogin.go",
      isXml: true,
      transformation: {
        buyRate: (data) => {
          const countries = data.getElementsByTagName("country");
          for (const ctr of countries) {
            if (
              ctr.getElementsByTagName("name")[0].innerHTML === "Costa Rica"
            ) {
              const buy = ctr.getElementsByTagName("buyRateUSD")[0].innerHTML;
              return +buy;
            }
          }
        },
        sellRate: (data) => {
          const countries = data.getElementsByTagName("country");
          for (const ctr of countries) {
            if (
              ctr.getElementsByTagName("name")[0].innerHTML === "Costa Rica"
            ) {
              const sell = ctr.getElementsByTagName("saleRateUSD")[0].innerHTML;
              return +sell;
            }
          }
        },
        date: (data) => new Date(),
      },
    },
    // {
    //   name: "aribot",
    //   shortName: "ab",
    //   bankCode: 5800,
    //   pict: "/exchange-rates.widget/assets/aribot.png",
    //   url: "https://www.aribot.ai/_api/v1/access-tokens",
    //   web: "https://www.aribot.ai/",
    //   isHtml: true,
    //   transformation: {
    //     buyRate: (data) => {
    //       return new Promise((resolve, reject) => {
    //         const builtInProxy = "http://127.0.0.1:41417/";
    //         fetch(`https://www.aribot.ai/_api/wix-code-public-dispatcher-ng/siteview/_webMethods/backend/aModule.jsw/getRandomGreeting.ajax?gridAppId=05e146aa-5180-4aeb-8758-a6dab4af1fee&viewMode=site`)
    //         .then((response) => {
    //           {
    //             response.json().then((data) => {
    //               const result = {
    //                 statusCode: 200,
    //                 buy: Bank.transformation.buyRate(data),
    //                 sell: Bank.transformation.sellRate(data),
    //                 date: Bank.transformation.date(data),
    //               };
    //               response(result)
    //             });
    //           }
    //         })
    //         .catch((error) => {
    //           reject(error );
    //         });
    //       })
          
    //       const buy = data.getElementById("tc-compra").innerHTML;
    //       return +buy
    //     },
    //     sellRate: (data) => {
    //       const sell = data.getElementById("tc-venta").innerHTML;
    //       return +sell
    //     },
    //     date: (data) => new Date(),
    //   },
    // },
    // {
    //   name: "suap",
    //   shortName: "sp",
    //   bankCode: 1200,
    //   pict: "/exchange-rates.widget/assets/suap.png",
    //   url: "https://suap.cr",
    //   web: "https://suap.cr",
    //   isHtml: true,
    //   transformation: {
    //     buyRate: (data) => {
    //       const buy = data.getElementById("tc-compra").innerHTML;
    //       return +buy
    //     },
    //     sellRate: (data) => {
    //       const sell = data.getElementById("tc-venta").innerHTML;
    //       return +sell
    //     },
    //     date: (data) => new Date(),
    //   },
    // }
  ],
};
