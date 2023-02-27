import './index.less';
import _DropdownMenu from './dropdown-menu';
import DropdownItem from './dropdown-item';
import { attachPropertiesToComponent } from '../utils/attach-properties-to-component';

const DropdownMenu = attachPropertiesToComponent(_DropdownMenu, {
  Item: DropdownItem,
});
export { DropdownMenu };
export default DropdownMenu;
export type {
  DropdownMenuProps,
  DropdownItemProps,
  DropdownMenuOption,
  DropdownMenuInstance,
} from './type';
