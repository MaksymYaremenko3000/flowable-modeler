<template>
  <div>
    <x-form ref="xForm" v-model="formData" :config="formConfig">
      <template #executionListener>
        <el-badge :value="executionListenerLength">
          <el-button size="small" @click="dialogName = 'executionListenerDialog'">Edit</el-button>
        </el-badge>
      </template>
      <template #taskListener>
        <el-badge :value="taskListenerLength">
          <el-button size="small" @click="dialogName = 'taskListenerDialog'">Edit</el-button>
        </el-badge>
      </template>
      <template #multiInstance>
        <el-badge :is-dot="hasMultiInstance">
          <el-button size="small" @click="dialogName = 'multiInstanceDialog'">Edit</el-button>
        </el-badge>
      </template>
    </x-form>
    <executionListenerDialog
        v-if="dialogName === 'executionListenerDialog'"
        :element="element"
        :modeler="modeler"
        @close="finishExecutionListener"
    />
    <taskListenerDialog
        v-if="dialogName === 'taskListenerDialog'"
        :element="element"
        :modeler="modeler"
        @close="finishTaskListener"
    />
    <multiInstanceDialog
        v-if="dialogName === 'multiInstanceDialog'"
        :element="element"
        :modeler="modeler"
        @close="finishMultiInstance"
    />
  </div>
</template>

<script>
import mixinPanel from '../../common/mixinPanel'
import executionListenerDialog from './property/executionListener'
import taskListenerDialog from './property/taskListener'
import multiInstanceDialog from './property/multiInstance'
import { commonParse, userTaskParse } from '../../common/parseElement'

export default {
  components: {
    executionListenerDialog,
    taskListenerDialog,
    multiInstanceDialog
  },
  mixins: [mixinPanel],
  props: {
    users: {
      type: Array,
      required: true
    },
    groups: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      userTypeOption: [
        { label: 'Assignee', value: 'assignee' },
        { label: 'Candidate Users', value: 'candidateUsers' },
        { label: 'Candidate Groups', value: 'candidateGroups' }
      ],
      dialogName: '',
      executionListenerLength: 0,
      taskListenerLength: 0,
      hasMultiInstance: false,
      formData: {}
    }
  },
  computed: {
    formConfig() {
      const _this = this
      return {
        inline: false,
        item: [
          {
            xType: 'input',
            name: 'id',
            label: 'Node ID',
            rules: [{ required: true, message: 'ID cannot be empty' }]
          },
          {
            xType: 'input',
            name: 'name',
            label: 'Node Name'
          },
          {
            xType: 'input',
            name: 'documentation',
            label: 'Node Description'
          },
          {
            xType: 'slot',
            name: 'executionListener',
            label: 'Execution Listener'
          },
          {
            xType: 'slot',
            name: 'taskListener',
            label: 'Task Listener',
            show: !!_this.showConfig.taskListener
          },
          {
            xType: 'select',
            name: 'userType',
            label: 'User Type',
            dic: _this.userTypeOption,
            show: !!_this.showConfig.userType
          },
          {
            xType: 'select',
            name: 'assignee',
            label: 'Assignee',
            allowCreate: true,
            filterable: true,
            dic: { data: _this.users, label: 'name', value: 'id' },
            show: !!_this.showConfig.assignee && _this.formData.userType === 'assignee'
          },
          {
            xType: 'select',
            name: 'candidateUsers',
            label: 'Candidate Users',
            multiple: true,
            allowCreate: true,
            filterable: true,
            dic: { data: _this.users, label: 'name', value: 'id' },
            show: !!_this.showConfig.candidateUsers && _this.formData.userType === 'candidateUsers'
          },
          {
            xType: 'select',
            name: 'candidateGroups',
            label: 'Candidate Groups',
            multiple: true,
            allowCreate: true,
            filterable: true,
            dic: { data: _this.groups, label: 'name', value: 'id' },
            show: !!_this.showConfig.candidateGroups && _this.formData.userType === 'candidateGroups'
          },
          {
            xType: 'slot',
            name: 'multiInstance',
            label: 'Multi-Instance'
          },
          {
            xType: 'switch',
            name: 'async',
            label: 'Asynchronous',
            activeText: 'Yes',
            inactiveText: 'No',
            show: !!_this.showConfig.async
          },
          {
            xType: 'input',
            name: 'priority',
            label: 'Priority',
            show: !!_this.showConfig.priority
          },
          {
            xType: 'input',
            name: 'formKey',
            label: 'Form Key',
            show: !!_this.showConfig.formKey
          },
          {
            xType: 'input',
            name: 'skipExpression',
            label: 'Skip Expression',
            show: !!_this.showConfig.skipExpression
          },
          {
            xType: 'switch',
            name: 'isForCompensation',
            label: 'Is For Compensation',
            activeText: 'Yes',
            inactiveText: 'No',
            show: !!_this.showConfig.isForCompensation
          },
          {
            xType: 'switch',
            name: 'triggerable',
            label: 'Triggerable',
            activeText: 'Yes',
            inactiveText: 'No',
            show: !!_this.showConfig.triggerable
          },
          {
            xType: 'switch',
            name: 'autoStoreVariables',
            label: 'Auto Store Variables',
            activeText: 'Yes',
            inactiveText: 'No',
            show: !!_this.showConfig.autoStoreVariables
          },
          {
            xType: 'input',
            name: 'ruleVariablesInput',
            label: 'Input Variables',
            show: !!_this.showConfig.ruleVariablesInput
          },
          {
            xType: 'input',
            name: 'rules',
            label: 'Rules',
            show: !!_this.showConfig.rules
          },
          {
            xType: 'input',
            name: 'resultVariable',
            label: 'Result Variable',
            show: !!_this.showConfig.resultVariable
          },
          {
            xType: 'switch',
            name: 'exclude',
            label: 'Exclude',
            activeText: 'Yes',
            inactiveText: 'No',
            show: !!_this.showConfig.exclude
          },
          {
            xType: 'input',
            name: 'class',
            label: 'Class',
            show: !!_this.showConfig.class
          },
          {
            xType: 'datePicker',
            type: 'datetime',
            name: 'dueDate',
            label: 'Due Date',
            show: !!_this.showConfig.dueDate
          }
        ]
      }
    }
  },
  watch: {
    'formData.userType': function(val, oldVal) {
      if (oldVal) {
        const types = ['assignee', 'candidateUsers', 'candidateGroups']
        types.forEach(type => {
          delete this.element.businessObject.$attrs[`flowable:${type}`]
          delete this.formData[type]
        })
      }
    },
    'formData.assignee': function(val) {
      if (this.formData.userType !== 'assignee') {
        delete this.element.businessObject.$attrs[`flowable:assignee`]
        return
      }
      this.updateProperties({ 'flowable:assignee': val })
    },
    'formData.candidateUsers': function(val) {
      if (this.formData.userType !== 'candidateUsers') {
        delete this.element.businessObject.$attrs[`flowable:candidateUsers`]
        return
      }
      this.updateProperties({ 'flowable:candidateUsers': val?.join(',') })
    },
    'formData.candidateGroups': function(val) {
      if (this.formData.userType !== 'candidateGroups') {
        delete this.element.businessObject.$attrs[`flowable:candidateGroups`]
        return
      }
      this.updateProperties({ 'flowable:candidateGroups': val?.join(',') })
    },
    'formData.async': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:async': true })
    },
    'formData.dueDate': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:dueDate': val })
    },
    'formData.formKey': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:formKey': val })
    },
    'formData.priority': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:priority': val })
    },
    'formData.skipExpression': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:skipExpression': val })
    },
    'formData.isForCompensation': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'isForCompensation': val })
    },
    'formData.triggerable': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:triggerable': val })
    },
    'formData.class': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:class': val })
    },
    'formData.autoStoreVariables': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:autoStoreVariables': val })
    },
    'formData.exclude': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:exclude': val })
    },
    'formData.ruleVariablesInput': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:ruleVariablesInput': val })
    },
    'formData.rules': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:rules': val })
    },
    'formData.resultVariable': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:resultVariable': val })
    }
  },
  created() {
    let cache = commonParse(this.element)
    cache = userTaskParse(cache)
    this.formData = cache
    this.computedExecutionListenerLength()
    this.computedTaskListenerLength()
    this.computedHasMultiInstance()
  },
  methods: {
    computedExecutionListenerLength() {
      this.executionListenerLength = this.element.businessObject.extensionElements?.values
          ?.filter(item => item.$type === 'flowable:ExecutionListener').length ?? 0
    },
    computedTaskListenerLength() {
      this.taskListenerLength = this.element.businessObject.extensionElements?.values
          ?.filter(item => item.$type === 'flowable:TaskListener').length ?? 0
    },
    computedHasMultiInstance() {
      this.hasMultiInstance = !!this.element.businessObject.loopCharacteristics
    },
    finishExecutionListener() {
      if (this.dialogName === 'executionListenerDialog') {
        this.computedExecutionListenerLength()
      }
      this.dialogName = ''
    },
    finishTaskListener() {
      if (this.dialogName === 'taskListenerDialog') {
        this.computedTaskListenerLength()
      }
      this.dialogName = ''
    },
    finishMultiInstance() {
      if (this.dialogName === 'multiInstanceDialog') {
        this.computedHasMultiInstance()
      }
      this.dialogName = ''
    }
  }
}
</script>

<style></style>
