<template>
  <div>
    <el-dialog
      title="Task Listener"
      :visible.sync="dialogVisible"
      width="900px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      @closed="$emit('close')"
    >
      <x-form ref="xForm" v-model="formData" :config="formConfig">
        <template #params="scope">
          <el-badge
            :value="scope.row.params ? scope.row.params.length : 0"
            type="primary"
          >
            <el-button size="small" @click="configParam(scope.$index)"
              >Configure</el-button
            >
          </el-badge>
        </template>
      </x-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click="closeDialog"
          >Confirm</el-button
        >
      </span>
    </el-dialog>
    <listenerParam
      v-if="showParamDialog"
      :value="formData.taskListener[nowIndex].params"
      @close="finishConfigParam"
    />
  </div>
</template>

<script>
import mixinPanel from "../../../common/mixinPanel";
import listenerParam from "./listenerParam";
export default {
  components: { listenerParam },
  mixins: [mixinPanel],
  data() {
    return {
      dialogVisible: true,
      showParamDialog: false,
      nowIndex: null,
      formData: {
        taskListener: [],
      },
    };
  },
  computed: {
    formConfig() {
      return {
        inline: false,
        item: [
          {
            xType: "tabs",
            tabs: [
              {
                label: "Task Listener",
                name: "taskListener",
                column: [
                  {
                    label: "Event",
                    name: "event",
                    width: 180,
                    rules: [
                      {
                        required: true,
                        message: "Please select",
                        trigger: ["blur", "change"],
                      },
                    ],
                    xType: "select",
                    dic: [
                      { label: "create", value: "create" },
                      { label: "assignment", value: "assignment" },
                      { label: "complete", value: "complete" },
                      { label: "delete", value: "delete" },
                    ],
                    tooltip: `create: Triggered when the task is created and all parameters are set.<br />
                              assignment: Triggered when the task is assigned to someone. Note: this event is triggered *before* the "create" event.<br />
                              complete: Triggered when the task is completed, just before it is removed from runtime.<br />
                              delete: Triggered just before the task is deleted. Note: completing a task via completeTask also triggers this.`,
                  },
                  {
                    label: "Type",
                    name: "type",
                    width: 180,
                    rules: [
                      {
                        required: true,
                        message: "Please select",
                        trigger: ["blur", "change"],
                      },
                    ],
                    xType: "select",
                    dic: [
                      { label: "Class", value: "class" },
                      { label: "Expression", value: "expression" },
                      {
                        label: "Delegate Expression",
                        value: "delegateExpression",
                      },
                    ],
                  },
                  {
                    label: "Java Class Name",
                    name: "className",
                    xType: "input",
                    rules: [
                      {
                        required: true,
                        message: "Please enter",
                        trigger: ["blur", "change"],
                      },
                    ],
                  },
                  {
                    xType: "slot",
                    label: "Parameters",
                    width: 120,
                    slot: true,
                    name: "params",
                  },
                ],
              },
            ],
          },
        ],
      };
    },
  },
  mounted() {
    this.formData.taskListener =
      this.element.businessObject.extensionElements?.values
        .filter((item) => item.$type === "flowable:TaskListener")
        .map((item) => {
          let type;
          if ("class" in item) type = "class";
          if ("expression" in item) type = "expression";
          if ("delegateExpression" in item) type = "delegateExpression";
          return {
            event: item.event,
            type: type,
            className: item[type],
            params:
              item.fields?.map((field) => {
                let fieldType;
                if ("stringValue" in field) fieldType = "stringValue";
                if ("expression" in field) fieldType = "expression";
                return {
                  name: field.name,
                  type: fieldType,
                  value: field[fieldType],
                };
              }) ?? [],
          };
        }) ?? [];
  },
  methods: {
    configParam(index) {
      this.nowIndex = index;
      const nowObj = this.formData.taskListener[index];
      if (!nowObj.params) {
        nowObj.params = [];
      }
      this.showParamDialog = true;
    },
    finishConfigParam(param) {
      this.showParamDialog = false;
      const cache = this.formData.taskListener[this.nowIndex];
      cache.params = param;
      this.$set(
        this.formData.taskListener[this.nowIndex],
        this.nowIndex,
        cache
      );
      this.nowIndex = null;
    },
    updateElement() {
      if (this.formData.taskListener?.length) {
        let extensionElements =
          this.element.businessObject.get("extensionElements");
        if (!extensionElements) {
          extensionElements = this.modeler
            .get("moddle")
            .create("bpmn:ExtensionElements");
        }
        extensionElements.values =
          extensionElements.values?.filter(
            (item) => item.$type !== "flowable:TaskListener"
          ) ?? [];
        this.formData.taskListener.forEach((item) => {
          const taskListener = this.modeler
            .get("moddle")
            .create("flowable:TaskListener");
          taskListener["event"] = item.event;
          taskListener[item.type] = item.className;
          if (item.params && item.params.length) {
            item.params.forEach((field) => {
              const fieldElement = this.modeler
                .get("moddle")
                .create("flowable:Field");
              fieldElement["name"] = field.name;
              fieldElement[field.type] = field.value;
              taskListener.get("fields").push(fieldElement);
            });
          }
          extensionElements.get("values").push(taskListener);
        });
        this.updateProperties({ extensionElements: extensionElements });
      } else {
        const extensionElements =
          this.element.businessObject[`extensionElements`];
        if (extensionElements) {
          extensionElements.values =
            extensionElements.values?.filter(
              (item) => item.$type !== "flowable:TaskListener"
            ) ?? [];
        }
      }
    },
    closeDialog() {
      this.$refs.xForm
        .validate()
        .then(() => {
          this.updateElement();
          this.dialogVisible = false;
        })
        .catch((e) => console.error(e));
    },
  },
};
</script>

<style>
.flow-containers .el-badge__content.is-fixed {
  top: 18px;
}
</style>
