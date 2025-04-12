
import Vue from 'vue'
import App from './Demo.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'
import xcrudConfig from 'xcrud/package/common/config'

xcrudConfig.set({
  select: {
    placeholder: 'Select',
    noDataText: 'No data',
    noMatchText: 'No match',
    loadingText: 'Loading...'
  },
  xtable: {
    table: {
      emptyText: 'No Data',
      sumText: 'Total',
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
          addConfig: {
            text: 'Add',
          },
          operate: {
            label: 'Actions',
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
