import './index.less';
import DropdownMenu from './dropdown-menu';
import DropdownItem from './dropdown-item';
export type { DropdownMenuProps, DropdownItemProps, DropdownMenuOption } from './type';
import { attachPropertiesToComponent } from '../utils/attach-properties-to-component';

export default attachPropertiesToComponent(DropdownMenu, {
  Item: DropdownItem,
});
