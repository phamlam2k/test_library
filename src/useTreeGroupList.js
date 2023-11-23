import { useCallback, useMemo, useState } from "react";
import { getTreeDeviceConvert } from "./function";

const useTreeGroupList = (getTreeGroupDevice) => {
  const [selectedList, setSelectedList] = useState([]);

  const treeGroupList = useMemo(() => {
    return getTreeGroupDevice;
  }, [getTreeGroupDevice]);

  const treeConvertGroup = useMemo(() => {
    if (!treeGroupList) return undefined;

    return getTreeDeviceConvert(treeGroupList);
  }, [treeGroupList]);

  const handleConvertToArr = useCallback(
    (groupId) => {
      let deviceList = [];

      const nodeFind = treeGroupList.nodeList.find(
        (node) => node.id === groupId
      );

      if (nodeFind && nodeFind.deviceList && nodeFind.deviceList.length > 0) {
        deviceList = nodeFind.deviceList.map((device) => ({
          ...device,
          type: "device",
          name: device.camName,
          children: [],
        }));
      }

      return {
        ...treeConvertGroup[groupId],
        type: "group",
        name: treeConvertGroup[groupId].label,
        children: [
          ...deviceList,
          ...(treeConvertGroup[groupId].children.length > 0
            ? treeConvertGroup[groupId].children.map((childId) => ({
                ...handleConvertToArr(childId),
                type: "group",
              }))
            : []),
        ],
      };
    },
    [treeConvertGroup, treeGroupList]
  );

  const dataGroupList = useMemo(() => {
    return {
      ...treeConvertGroup[treeGroupList.currentNode.id],
      children: treeConvertGroup[treeGroupList.currentNode.id].children.map(
        (groupId) => handleConvertToArr(groupId)
      ),
      name: treeConvertGroup[treeGroupList.currentNode.id].label,
    };
  }, [handleConvertToArr, treeConvertGroup, treeGroupList]);

  const handleCheckItem = (e) => {
    if (e.target.checked) {
      setSelectedList((prev) => [...prev, e.target.value]);
    } else {
      setSelectedList((prev) =>
        [...prev].filter((item) => item !== e.target.value)
      );
    }
  };

  return {
    data: dataGroupList,
    selectedList,

    handleCheckItem,
  };
};

export default useTreeGroupList;
