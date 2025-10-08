export const buildSidebarTree = (items, permissions) => {
  return items
    .map(item => {
      if (item.children) {
        const filteredChildren = buildSidebarTree(item.children, permissions);

        if (permissions.includes(item.id)) {
          // Padre permesso → prendi tutti i figli
          return { ...item, children: item.children };
        }

        if (filteredChildren.length > 0) {
          return { ...item, children: filteredChildren };
        }

        return null;
      } else {
        return permissions.includes(item.id) ? item : null;
      }
    })
    .filter(Boolean);
};
