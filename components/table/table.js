// pages/components/table/table.js
Component({
    options: {
        multipleSlots: true, // 在组件定义时的选项中启用多slot支持
        styleIsolation: 'apply-shared'
    },
    properties: {
        drawOption: { type: Object, value: {} },
        scroll: { type: Object, value: {} },
        columns: { type: Array, value: [] },
        dataSource: { type: Array, value: [] },
        showSummary:{ type:Boolean, value:false },
        notSummaryArr:{ type:Array, value:[] },
        onManageSummary:{ type:Function, value:undefined }
    },
    data: {
        tableDrawOption: {
            width: 0,
            scrollLeft: 0,
            defaultScrollLeft: 0,
            scrollBodyTop: 0,
            leftWidth: 0,
            rightWidth: 0,
            stashTop: 0,
            scroll: {}
        },
        curColumns: [],
        fixColumns: [],
        curDataSource: [],
        summaryData:{}
    },
    lifetimes: {
        attached() {
            this.init();
        }
    },
    observers: {
        'columns, dataSource, drawOption': function(newData) {
            this.init();
        }
    },
    methods: {
        init() {
            let fixColumns = [];
            let { showSummary } = this.properties;
            let { columns, dataSource, scroll, tableDrawOption, drawOption } = this.data;
            let { momColumns, leftColumns, rightColumns } = this.processColumns(columns);
            let momDatasource = this.processDataSource(dataSource);
            let tableWidth = this.getTableScrollWidth(columns);
            let tableLeftWidth = this.getTableScrollWidth(leftColumns);
            let tableRightWidth = this.getTableScrollWidth(rightColumns);
            leftColumns.length > 0 ? fixColumns.push({ columns: leftColumns, width: tableLeftWidth, fixed: 'left' }) : '';
            rightColumns.length > 0 ? fixColumns.push({ columns: leftColumns, width: tableLeftWidth, fixed: 'right' }) : '';
            showSummary && this.initSummaryData();
            this.setData({
                tableDrawOption: Object.assign(tableDrawOption, drawOption),
                curColumns: momColumns,
                fixColumns: fixColumns,
                curDataSource: momDatasource,
                'tableDrawOption.width': tableWidth,
                'tableDrawOption.leftWidth': tableLeftWidth,
                'tableDrawOption.rightWidth': tableRightWidth,
                'tableDrawOption.scroll': scroll
            });
        },
        processColumns(columns) {
            let momColumns = [], leftColumns = [], rightColumns = [];
            columns.forEach(e => {
                let { fixed } = e;
                switch (fixed) {
                    case 'left':
                        leftColumns.push(e);
                        break;
                    case 'right':
                        rightColumns.push(e);
                        break;
                    default:
                        momColumns.push(e);
                        break;
                }
            });
            return { momColumns, leftColumns, rightColumns };
        },
        processDataSource(dataSource) {
            return dataSource.map(e => {
                // console.log('e---', e);
                return e;
            });
        },
        getTableScrollWidth(columns) {
            let sumWidth = columns.reduce((acc, cur) => {
                let { width } = cur;
                return acc + Number(width);
            }, 0);
            return sumWidth;
        },
        bindTablescroll(e) {
            let { detail } = e;
            let { scrollLeft } = detail;
            this.setData({
                'tableDrawOption.scrollLeft': scrollLeft
            });
        },
        bindBodyscroll(e) {
            let { tableDrawOption: { stashTop } } = this.data;
            let { detail } = e;
            let { scrollTop } = detail;
            if (Math.abs(scrollTop - stashTop) > 1 || true) {
                this.setData({
                    'tableDrawOption.stashTop': scrollTop,
                    'tableDrawOption.scrollBodyTop': scrollTop
                });
            }
        },
        initSummaryData() {
            let { onManageSummary = null, notSummaryArr = [], dataSource = [], columns = [] } = this.properties;
			let momDataSource = {};
            console.log("onManageSummary--", onManageSummary);
			if (typeof onManageSummary === "function") {
				momDataSource = onManageSummary({ dataSource, notSummaryArr });
			} else {
				dataSource.forEach((e) => {
					for(let key in e) {
						let momVal = Number.getNumber(e[key] || 0);
						if (momDataSource[key]) {
							momDataSource[key] += momVal;
						} else {
							momDataSource[key] = momVal;
						}
						momDataSource[key] = Number.getNumber(momDataSource[key] || 0);
					}
				});
                columns[0] ? momDataSource[columns[0].dataIndex] = '合计' : '';
			}
            this.setData({ summaryData: momDataSource });
		},
        theadClick(e) {
            let { curColumns, fixColumns } = this.data;
            let { currentTarget: { dataset: { item = {}, columnkey = '', index }} } = e;
            let { sortType, dataIndex, sorted } = item;
            let momColumns = [];
            let momSortOrder = '';
            if (!sorted) {
                return;
            }
            momSortOrder = sortType === '' ? 'ascend' : sortType === 'ascend' ? 'descend' : '' ;
            switch (columnkey) {
                case 'curColumns':
                    momColumns = curColumns;
                    momColumns = momColumns.map(c => {
                        dataIndex === c.dataIndex ? c.sortType = momSortOrder : '';
                        return c;
                    });
                    this.setData({ curColumns: momColumns });
                    break;
                case 'fixColumns':
                    momColumns = fixColumns[index].columns;
                    momColumns = momColumns.map(c => {
                        dataIndex === c.dataIndex ? c.sortType = momSortOrder : '';
                        return c;
                    });
                    this.setData({ [`fixColumns[${index}.columns]`]: momColumns });
                    break;
                default:
                    break;
            }
            this.triggerEvent('tableFilter', { columns: [...curColumns, ...fixColumns], currentCol: { dataIndex, sortType: momSortOrder } });
        },
        bodyClick(e) {
            this.triggerEvent('click', { value: e.detail.value })
        }
    }
})
