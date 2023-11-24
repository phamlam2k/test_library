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

export function containsAllElements(array1, array2) {
  return array2.every((element) => array1[element]);
}

export const filterTreeKeyWord = (nodes, keyWord) => {
  if (!keyWord) return nodes;
  let filteredNodes = [];

  nodes.forEach((node) => {
    if (node.name.toLowerCase().includes(keyWord)) {
      filteredNodes.push(node);
    } else if (node.children) {
      const childNodes = filterTreeKeyWord(node.children, keyWord);
      if (childNodes.length > 0) {
        filteredNodes.push({ ...node, children: childNodes });
      }
    }
  });

  if (filteredNodes.length > 0) {
    return filteredNodes;
  } else {
    return [];
  }
};
