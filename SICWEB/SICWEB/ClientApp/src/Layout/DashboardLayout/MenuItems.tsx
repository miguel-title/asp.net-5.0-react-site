import {
  useState,
  useEffect
} from 'react';
import type { FC } from 'react';
import {
  Box
} from '@material-ui/core';

import {getMenuList} from 'src/apis/menuApi'
import MultiSelect from './MultiMenu';

const MenuItems: FC = () => {

  const [menus, setMenus] = useState<any>([]);  

  function listToTree(list) {
    var map = {}, node, roots = [], i;    
    for (i = 0; i < list.length; i += 1) {
      map[list[i].menu_c_iid] = i; 
      list[i].children = []; 
    }    
    for (i = 0; i < list.length; i += 1) {
      node = list[i];
      if (node.menu_c_iid_padre !== null) {
        list[map[node.menu_c_iid_padre]].children.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  }

  useEffect(() => {
    getMenuList().then(res => {
      setMenus(listToTree(res));
    });    
  }, []);

  useEffect(() => {
  }, [menus]);

  const handleMultiSelectChange = () => {}
  return (
    <Box
      display="flex"
      alignItems="center"
      flexWrap="wrap"
      p={1}
    >
      {menus.map((menu, index) => (
        <MultiSelect
          key={new Date() + index}
          label={menu.menu_c_vnomb}
          onChange={handleMultiSelectChange}
          options={menu.children}
          value={[]}
        />
      ))}
    </Box>
  );
};

export default MenuItems;
