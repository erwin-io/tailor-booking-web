// self executing function here
(function () {
  // your page initialization code here
  // the DOM will be available here

  const _company = document.querySelector("#company");
  const _date = document.querySelector("#date");
  const _customerName = document.querySelector("#customer-name");
  const _address = document.querySelector("#address");

  const _totalPriceKey = document.querySelector("#total-price-key");
  const _totalPriceCount = document.querySelector("#total-price-count");
  const _totalPriceValue = document.querySelector("#total-price-value");

  const _othersKey = document.querySelector("#others-key");
  const _othersCount = document.querySelector("#others-count");
  const _othersValue = document.querySelector("#others-value");
  const _total = document.querySelector("#total-amount");
  function loadReceipt(e) {
    
    console.log("loading receipt...");
    if (e.detail && e.detail !== undefined) {
      let {
        company,
        date,
        customerName,
        address,
        totalPriceKey,
        totalPriceCount,
        totalPriceValue,
        othersKey,
        othersCount,
        othersValue,
      } = e.detail;

      totalPriceValue =
        totalPriceValue && !isNaN(totalPriceValue)
          ? Number(totalPriceValue)
          : 0;
      othersValue =
        othersValue && !isNaN(othersValue) ? Number(othersValue) : 0;
      const total = totalPriceValue + othersValue;

      _company.innerText = company;
      _date.innerText = date;
      _customerName.innerText = customerName;
      _address.innerText = address;
      _totalPriceKey.innerText = totalPriceKey;
      _totalPriceCount.innerText = totalPriceCount;
      _totalPriceValue.innerText = totalPriceValue;
      _othersKey.innerText = othersKey;
      _othersCount.innerText = othersCount;
      _othersValue.innerText = othersValue;
      _total.innerText = total;
    }
  }
  window.document.addEventListener("loadReceipt", (e)=> {
    loadReceipt(e)
  }, false);

  window.document.addEventListener(
    "printReceipt",
    (e) => {
      console.log("print receipt...");
      window.print();
    },
    false
  );
})();
