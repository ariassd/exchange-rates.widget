export const Config = {
  show: "bac",
  defaultBrowser: "open -a Google\\ Chrome.app",
  banks: [
    {
      name: "coopenae",
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
      name: "bcr",
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
  ],
};
