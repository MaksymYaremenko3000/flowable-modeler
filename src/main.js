
import Vue from 'vue'
import App from './Demo.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'
import xcrudConfig from 'xcrud/package/common/config'

xcrudConfig.set({
  select: {
    placeholder: 'Select',
    loadingText: 'Loading...',
    noMatchText: 'No matching data',
    noDataText: 'No data'
  },
  datePicker: {
    placeholder: 'Select date',
    startPlaceholder: 'Start time',
    endPlaceholder: 'End time'
  },
  xtable: {
    table: {
      emptyText: 'No data',
      sumText: 'Total'
    },
    search: {
      btn: {
        searchBtn: {
          text: 'Search'
        },
        resetBtn: {
          text: 'Reset'
        }
      }
    },
    operate: {
      column: {
        label: 'Actions'
      }
    }
  },
  xform: {
    form: {
      tabs: {
        table: {
          emptyText: 'No data',
          sumText: 'Total',
          addConfig: {
            text: 'Add'
          },
          operate: {
            label: 'Actions'
          }
        }
      }
    }
  }
})

Vue.config.productionTip = false

Vue.use(ElementUI, { locale })

new Vue({
  render: h => h(App)
}).$mount('#app')
