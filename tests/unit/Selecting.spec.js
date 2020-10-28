import { mount, shallowMount } from "@vue/test-utils";
import VueSelect from "../../src/components/Select.vue";
import typeAheadPointer from "../../src/mixins/typeAheadPointer";
import { mountDefault } from '../helpers';

describe("VS - Selecting Values", () => {
  let defaultProps;
  let spy;

  beforeEach(() => {
    defaultProps = {
      modelValue: "one",
      options: ["one", "two", "three"]
    };
  });

  afterEach(() => {
    if (spy) spy.mockClear();
  });

  it("can accept an array with pre-selected values", () => {
    const Select = shallowMount(VueSelect, {
      props: defaultProps
    });
    expect(Select.vm.selectedValue[0]).toEqual(Select.vm.modelValue);
  });

  it("can accept an array of objects and pre-selected value (single)", () => {
    const Select = shallowMount(VueSelect, {
      props: {
        modelValue: { label: "This is Foo", value: "foo" },
        options: [
          { label: "This is Foo", value: "foo" },
          { label: "This is Bar", value: "bar" }
        ]
      }
    });
    expect(Select.vm.selectedValue[0]).toEqual(Select.vm.modelValue);
  });

  it("can accept an array of objects and pre-selected values (multiple)", () => {
    const Select = shallowMount(VueSelect, {
      props: {
        modelValue: [
          { label: "This is Foo", value: "foo" },
          { label: "This is Bar", value: "bar" }
        ],
        options: [
          { label: "This is Foo", value: "foo" },
          { label: "This is Bar", value: "bar" }
        ]
      },
      multiple: true
    });

    expect(Select.vm.selectedValue).toEqual(Select.vm.modelValue);
  });

  it("can select an option on tab", () => {

    spy = jest.spyOn(typeAheadPointer.methods, "typeAheadSelect");
    const Select = shallowMount(VueSelect, {
      props: {
        selectOnTab: true
      }
    });

    Select.get("input").trigger("keydown.tab");

    expect(spy).toHaveBeenCalledWith();
  });

  it("can deselect a pre-selected object", () => {
    const Select = shallowMount(VueSelect, {
      props: {
        multiple: true,
        options: [
          { label: "This is Foo", value: "foo" },
          { label: "This is Bar", value: "bar" }
        ]
      }
    });

    Select.vm.$data._value = [
      { label: "This is Foo", value: "foo" },
      { label: "This is Bar", value: "bar" }
    ];

    Select.vm.deselect({ label: "This is Foo", value: "foo" });
    expect(Select.vm.selectedValue).toEqual([{ label: "This is Bar", value: "bar" }]);
  });

  it("can deselect a pre-selected string", () => {
    const Select = shallowMount(VueSelect, {
      props: {
        multiple: true,
        options: ["foo", "bar"]
      }
    });

    Select.vm.$data._value = "foo";

    Select.vm.deselect("foo");
    expect(Select.vm.selectedValue).toEqual([]);
  });

  it("can deselect an option when multiple is false", () => {
    const Select = shallowMount(VueSelect);

    Select.vm.$data._value = "foo";

    Select.vm.deselect("foo");
    expect(Select.vm.selectedValue).toEqual([]);
  });

  it("can determine if the value prop is empty", () => {
    const Select = shallowMount(VueSelect, {
      props: {
        options: ["one", "two", "three"]
      }
    });

    const select = Select.vm;
    expect(select.isValueEmpty).toEqual(true);

    select.select(["one"]);
    expect(select.isValueEmpty).toEqual(false);

    select.select("one");
    expect(select.isValueEmpty).toEqual(false);

    select.select({ label: "foo", value: "foo" });
    expect(select.isValueEmpty).toEqual(false);

    select.select("");
    expect(select.isValueEmpty).toEqual(true);

    select.select(null);
    expect(select.isValueEmpty).toEqual(true);
  });

  it("should reset the selected values when the multiple property changes", () => {
    const Select = shallowMount(VueSelect, {
      props: {
        multiple: true,
        options: ["one", "two", "three"]
      }
    });

    Select.setProps({ multiple: false });
    expect(Select.vm.selectedValue).toEqual([]);

    Select.setProps({ multiple: true });
    expect(Select.vm.selectedValue).toEqual([]);
  });

  it("can retain values present in a new array of options", () => {
    const Select = shallowMount(VueSelect, {
      props: {
        modelValue: ["one"],
        options: ["one", "two", "three"]
      }
    });

    Select.setProps({ options: ["one", "five", "six"] });
    expect(Select.vm.selectedValue).toEqual(["one"]);
  });

  it("can determine if an object is already selected", () => {
    const Select = shallowMount(VueSelect, {
      props: {
        modelValue: [{ label: "one" }],
        options: [{ label: "one" }]
      }
    });

    expect(Select.vm.isOptionSelected({ label: "one" })).toEqual(true);
  });

  it("can use v-model syntax for a two way binding to a parent component", () => {
    const Parent = mount({
      data: () => ({ value: "foo", options: ["foo", "bar", "baz"] }),
      template: `<div><v-select :options="options" v-model="value" /></div>`,
      components: { "v-select": VueSelect }
    });
    const Select = Parent.getComponent({ name: 'v-select' })

    expect(Select.vm.modelValue).toEqual("foo");
    expect(Select.vm.selectedValue).toEqual(["foo"]);

    Select.vm.select("bar");
    expect(Parent.vm.value).toEqual("bar");
  });

  it("can check if a string value is selected when the value is an object and multiple is true", () => {
    const Select = shallowMount(VueSelect, {
      props: {
        multiple: true,
        modelValue: [{ label: "foo", value: "bar" }]
      }
    });
    expect(Select.vm.isOptionSelected({ label: "foo", value: "bar" })).toEqual(true);
  });

  it('can select two options with the same label', () => {
    const options = [{label: 'one', id: 1}, {label: 'one', id: 2}];
    const Select = mountDefault({options, multiple: true});

    Select.vm.select({label: 'one', id: 1});
    Select.vm.select({label: 'one', id: 2});

    expect(Select.vm.selectedValue).toEqual(options);
  });

  describe("input Event", () => {
    it("will trigger the input event when the selection changes", () => {
      const Select = shallowMount(VueSelect);
      Select.vm.select("bar");
      expect(Select.emitted("update:modelValue")[0]).toEqual(["bar"]);
    });

    it("will trigger the input event when the selection changes and multiple is true", () => {
      const Select = shallowMount(VueSelect, {
        props: { multiple: true, modelValue: ["foo"], options: ["foo", "bar"] }
      });
      Select.vm.select("bar");
      expect(Select.emitted("update:modelValue")[0]).toEqual([["foo", "bar"]]);
    });
  });
});
