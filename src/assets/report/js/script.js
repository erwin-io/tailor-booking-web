
// self executing function here
(function() {
    // your page initialization code here
    // the DOM will be available here
    
    const pageTitle = document.querySelector('title');

    const containerTable = document.querySelector('.container.table');
    containerTable.innerHTML = `
    <h4 id="title">Report title</h4>
    <h5 id="sub-title">Report title</h5>
    <div class="row table">
      <div class="col-xs-12">
        <div class="table-responsive" data-pattern="priority-columns">
          <table class="table table-bordered table-hover">
            <caption class="text-center"></caption>
            <thead>
              <tr>
              </tr>
            </thead>
            <tbody>
            </tbody>
            <tfoot>
              <tr>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
    `;

    const reportTitle = document.querySelector('#title');
    const subTitle = document.querySelector('#sub-title');
    const header = document.querySelector('thead tr');
    const rowData = document.querySelector('tbody');
    const footer = document.querySelector('tfoot tr');
    header.innerHTML = '<th style="width: 100%;text-align: center!important">Header</th>';
    rowData.innerHTML = '<td style="width: 100%;text-align: center!important">No data available</td>';
    function loadReport(data, columns, footerText) {
        const rowTable = document.createElement("div")
        rowTable.className = "row table";


        colCells = [];
        rows = [];
        for (let i = 0; i < columns.length; i++) {
            let { key, value, width } = columns[i];
            width = width && width !== undefined && width !== "" && Number(width) > 0 ? width : 100 / columns.length;
            colCells += '<th style="width: ' + width + '%" data-priority="' + i + '">' + value + '</th>';
        }
        for (let i = 0; i < data.length; i++) {
          let row = '<tr>';
            for (let c = 0; c < columns.length; c++) {
                const value = data[i][columns[c].key];
                row += '<td>' + value + '</td>';
            }
            row += '</tr>';
            rows += row;
        }
        header.innerHTML = colCells;
        rowData.innerHTML = rows;
    }
    window.document.addEventListener('loadReport', (e)=> {
        console.log('loading report...');
        if(e.detail && e.detail !== undefined) {
            let { columns, data, pageName, reportName, subReportName, footerText } = e.detail;
            pageTitle.innerText = pageName;
            reportTitle.innerHTML = reportName;
            subTitle.innerHTML = subReportName;
            footer.innerHTML = '<td colspan="' + columns.length + '" class="text-left">' + footerText + '</td>';
            if(data && columns) {
                loadReport(data, columns, footerText);
            }
        }
    }, false);

    
    window.document.addEventListener('printReport', (e)=> {
        console.log('print report...');
        // loadReport(e.detail.data, e.detail.columns);
    }, false);

 })();