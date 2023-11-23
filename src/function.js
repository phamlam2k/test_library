export const getTreeDeviceConvert = (treeGroup) => {
  return treeGroup.nodeListWithoutDevices.reduce(
    (curNode, accumulateNode) => {
      let dataUpdate = {};

      if (curNode[accumulateNode.parentId]) {
        dataUpdate = {
          ...curNode,
          [accumulateNode.parentId]: {
            ...curNode[accumulateNode.parentId],
            children: [
              ...curNode[accumulateNode.parentId].children,
              accumulateNode.id,
            ],
          },
        };
      } else {
        const findNode = treeGroup.nodeListWithoutDevices.find(
          (node) => node.id === accumulateNode.parentId
        );

        dataUpdate = {
          ...curNode,
          [accumulateNode.parentId]: {
            ...findNode,
            children: [accumulateNode.id],
            type: "group",
            name: accumulateNode.label,
          },
        };
      }

      if (curNode[accumulateNode.id]) {
        return {
          ...dataUpdate,
          name: accumulateNode.label,
        };
      } else {
        return {
          ...dataUpdate,
          [accumulateNode.id]: {
            ...accumulateNode,
            children: [],
            type: "group",
            name: accumulateNode.label,
          },
        };
      }
    },
    {
      [treeGroup.currentNode.id]: {
        ...treeGroup.currentNode,
        children: [],
        type: "group",
        name: treeGroup.currentNode.label,
      },
    }
  );
};
