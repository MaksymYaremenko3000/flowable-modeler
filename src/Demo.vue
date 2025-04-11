<template>
  <div id="app">
    <bpmn-modeler
        ref="refNode"
        :xml="xml"
        :users="users"
        :groups="groups"
        :categorys="categorys"
        :is-view="false"
        @save="saveModeler"
    />
  </div>
</template>

<script>
import bpmnModeler from '../package/index'
export default {
  components: {
    bpmnModeler
  },
  data() {
    return {
      xml: '', // XML fetched from backend
      users: [
        { name: 'Zhang San', id: 'zhangsan' },
        { name: 'Li Si', id: 'lisi' },
        { name: 'Wang Wu', id: 'wangwu' }
      ],
      groups: [
        { name: 'Web Team', id: 'web' },
        { name: 'Java Team', id: 'java' },
        { name: 'Python Team', id: 'python' }
      ],
      categorys: [
        { name: 'OA', id: 'oa' },
        { name: 'Finance', id: 'finance' }
      ]
    }
  },
  mounted() {
    this.getModelDetail()
  },
  methods: {
    getModelDetail() {
      fetch('/Leave.bpmn20.xml')
          .then(response => {
            return response.text()
          }).then(xml => {
        this.xml = xml
      })
    },
    saveModeler(data) {
      console.log(data)
    }
  }
}
</script>

<style lang="scss">
html, body, #app {
  margin: 0;
}
</style>
