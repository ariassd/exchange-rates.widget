export const BankTransformation = {
  show: "coopenae",
  banks: [
    {
      name: "coopenae",
      pict: "/exchange-rates.widget/assets/coopenae.png",
      url: "https://www.vista360coopenae.fi.cr/TreasuryAPI/api/ExchangeRate?operatorCode=0&countryCode=CR&channelCode=WB&currencyCode=COL&type=1",
      transformation: {
        buyRate: (data) => +data.buyRate,
        sellRate: (data) => +data.sellRate,
        date: (data) => new Date(),
      },
    },
    {
      name: "bcr",
      pict: "/exchange-rates.widget/assets/bcr.png",
      url: "https://www.bancobcr.com/wps/proxy/http/bcrrestgen-app:24000/rest/api/v1/bcr-informativo/tipo-cambio/obtener/dolares",
      transformation: {
        buyRate: (data) => +data.compra.substring(0, 6),
        sellRate: (data) => +data.venta.substring(0, 6),
        date: (data) => new Date(),
      },
    },
    {
      name: "bct",
      pict: "/exchange-rates.widget/assets/bct.png",
      url: "https://app001.corporacionbct.com/Tailored.ICBanking.WebApi/api/framework/common/exchangeRates",
      transformation: {
        buyRate: (data) => +data[0].buyRate,
        sellRate: (data) => +data[0].sellRate,
        date: (data) => new Date(),
      },
    },
  ],
};
