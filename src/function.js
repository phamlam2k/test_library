export const getTreeDeviceConvert = (treeGroup) => {
  return treeGroup.nodeListWithoutDevices.reduce(
    (curNode, accumalteNode) => {
      let dataUpdate = {};

      if (curNode[accumalteNode.parentId]) {
        dataUpdate = {
          ...curNode,
          [accumalteNode.parentId]: {
            ...curNode[accumalteNode.parentId],
            children: [
              ...curNode[accumalteNode.parentId].children,
              accumalteNode.id,
            ],
          },
        };
      } else {
        const findNode = treeGroup.nodeListWithoutDevices.find(
          (node) => node.id === accumalteNode.parentId
        );

        dataUpdate = {
          ...curNode,
          [accumalteNode.parentId]: {
            ...findNode,
            children: [accumalteNode.id],
          },
        };
      }

      if (curNode[accumalteNode.id]) {
        return {
          ...dataUpdate,
        };
      } else {
        return {
          ...dataUpdate,
          [accumalteNode.id]: {
            ...accumalteNode,
            children: [],
          },
        };
      }
    },
    {
      [treeGroup.currentNode.id]: {
        ...treeGroup.currentNode,
        children: [],
      },
    }
  );
};
