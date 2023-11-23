import { useCallback, useMemo, useState } from "react";
import { getTreeDeviceConvert } from "./function";

const useTreeGroupList = (getTreeGroupDevice) => {
  const [selectedList, setSelectedList] = useState([]);

  const treeGroupList = useMemo(() => {
    return getTreeGroupDevice;
  }, [getTreeGroupDevice]);

  const treeConvertGroup = useMemo(() => {
    if (!treeGroupList) return undefined;

    const treeGroupObj = getTreeDeviceConvert(treeGroupList);

    return treeGroupList.nodeList.reduce(
      (cur, acc) => {
        const deviceObj = acc.deviceList.reduce((curDevice, accDevice) => {
          return {
            ...curDevice,
            [accDevice.id]: {
              ...accDevice,
              children: [],
              type: "device",
              name: accDevice.camName,
            },
          };
        }, {});

        return {
          ...cur,
          [acc.id]: {
            ...cur[acc.id],
            children: [
              ...acc.deviceList.map((device) => device.id),
              ...cur[acc.id].children,
            ],
          },
          ...deviceObj,
        };
      },
      {
        ...treeGroupObj,
      }
    );
  }, [treeGroupList]);

  const handleConvertToArr = useCallback(
    (groupId) => {
      return {
        ...treeConvertGroup[groupId],
        children: [
          ...(treeConvertGroup[groupId].children.length > 0
            ? treeConvertGroup[groupId].children.map((childId) => ({
                ...handleConvertToArr(childId),
                type: "group",
              }))
            : []),
        ],
      };
    },
    [treeConvertGroup]
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

  const handleGetChildArr = (groupId) => {
    let result = [];

    treeConvertGroup[groupId].children.forEach((item) => {
      if (treeConvertGroup[item].children.length > 0) {
        result = result.concat(handleGetChildArr(item));
      }
      result.push(item);
    });

    return result;
  };

  const handleCheckChild = (isChecked, groupId, selectArr) => {
    if (treeConvertGroup[groupId].children.length > 0) {
      const getList = handleGetChildArr(groupId);
      let selectArrChild = [...selectArr];

      if (isChecked) {
        selectArrChild = selectArrChild.concat(getList);
      } else {
        selectArrChild = selectArrChild.filter(
          (item) => !getList.includes(item)
        );
      }

      return selectArrChild;
    } else {
      return [...selectArr];
    }
  };

  const handleCheckParent = (isChecked, groupId) => {};

  const handleCheckItem = (e) => {
    let selectArr = [...selectedList];

    if (e.target.checked) {
      selectArr.push(e.target.value);
    } else {
      selectArr = selectArr.filter((item) => item !== e.target.value);
    }

    selectArr = handleCheckChild(e.target.checked, e.target.value, selectArr);

    setSelectedList(selectArr);
  };

  return {
    data: dataGroupList,
    selectedList,

    handleCheckItem,
  };
};

export default useTreeGroupList;
