import { DOMWrapper } from "@vue/test-utils"
import { mountDefault } from '../helpers';

describe('Custom Keydown Handlers', () => {

  it('can use the map-keydown prop to trigger custom behaviour', async () => {
    const onKeyDown = jest.fn();
    const Select = mountDefault({
      mapKeydown: (defaults, vm) => ({ ...defaults, 32: onKeyDown }),
    });

    await Select.get('input').trigger('keydown.space')

    expect(onKeyDown.mock.calls.length).toBe(1);
  });

  it('selectOnKeyCodes should trigger a selection for custom keycodes', () => {
    const Select = mountDefault({
      selectOnKeyCodes: [32],
    });

    const spy = jest.spyOn(Select.vm.$.ctx, 'typeAheadSelect');

    Select.get('input').trigger('keydown.space');

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('even works when combining selectOnKeyCodes with map-keydown', () => {
    const onKeyDown = jest.fn();
    const Select = mountDefault({
      mapKeydown: (defaults, vm) => ({ ...defaults, 32: onKeyDown }),
      selectOnKeyCodes: [9],
    });

    const spy = jest.spyOn(Select.vm.$.ctx, 'typeAheadSelect');

    Select.get('input').trigger('keydown.space');
    expect(onKeyDown.mock.calls.length).toBe(1);

    Select.get('input').trigger('keydown.tab');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  describe('CompositionEvent support', () => {

    it('will not select a value with enter if the user is composing', () => {
      const Select = mountDefault();
      const spy = jest.spyOn(Select.vm.$.ctx, 'typeAheadSelect');

      Select.get('input').trigger('compositionstart');
      Select.get('input').trigger('keydown.enter');
      expect(spy).toHaveBeenCalledTimes(0);

      Select.get('input').trigger('compositionend');
      Select.get('input').trigger('keydown.enter');
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('will not select a value with tab if the user is composing', () => {
      const Select = mountDefault({ selectOnTab: true });
      const spy = jest.spyOn(Select.vm.$.ctx, 'typeAheadSelect');

      Select.get('input').trigger('compositionstart');
      Select.get('input').trigger('keydown.tab');
      expect(spy).toHaveBeenCalledTimes(0);

      Select.get('input').trigger('compositionend');
      Select.get('input').trigger('keydown.tab');
      expect(spy).toHaveBeenCalledTimes(1);
    });

  });

});
