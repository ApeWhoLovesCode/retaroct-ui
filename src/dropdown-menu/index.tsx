import './index.less';
import DropdownMenu from './dropdown-menu';
import DropdownItem from './dropdown-item';
import { attachPropertiesToComponent } from '../utils/attach-properties-to-component';

export type {
  DropdownMenuProps,
  DropdownItemProps,
  DropdownMenuOption,
  DropdownMenuInstance,
} from './type';

export default attachPropertiesToComponent(DropdownMenu, {
  Item: DropdownItem,
});
