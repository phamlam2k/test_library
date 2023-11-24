import React, { useCallback, useMemo, useState } from "react";
import {
  containsAllElements,
  filterTreeKeyWord,
  getTreeDeviceConvert,
} from "./function";

const useTreeGroupList = (getTreeGroupDevice) => {
  const [keyWord, setKeyword] = useState("");
  const [selectedList, setSelectedList] = useState({});

  const treeGroupList = useMemo(() => {
    return getTreeGroupDevice;
  }, [getTreeGroupDevice]);

  const listDevice = useMemo(() => {
    return getTreeGroupDevice.nodeList.reduce((cur, acc) => {
      return [...cur, ...acc.deviceList.map((device) => device.id)];
    }, []);
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
              name: accDevice.camName ?? accDevice.id,
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

  const dataGroupListFilterKeyword = useMemo(() => {
    if (keyWord === "") return dataGroupList;
    return {
      ...dataGroupList,
      children: filterTreeKeyWord(
        dataGroupList.children,
        keyWord.toLowerCase()
      ),
    };
  }, [dataGroupList, keyWord]);

  console.log("dataGroupListFilterKeyword", dataGroupListFilterKeyword);
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

  const handleCheckChild = (isChecked, groupId, selectObj) => {
    if (treeConvertGroup[groupId].children.length > 0) {
      let selectObjChild = { ...selectObj };
      const getList = handleGetChildArr(groupId);

      if (isChecked) {
        selectObjChild = getList.reduce(
          (cur, acc) => {
            return {
              ...cur,
              [acc]: true,
            };
          },
          {
            ...selectObjChild,
          }
        );
      } else {
        selectObjChild = getList.reduce(
          (cur, acc) => {
            return {
              ...cur,
              [acc]: false,
            };
          },
          {
            ...selectObjChild,
          }
        );
      }

      return selectObjChild;
    } else {
      return { ...selectObj };
    }
  };

  const handleCheckParent = (isChecked, groupId, selectObj) => {
    const parentId =
      treeConvertGroup[groupId].type === "device"
        ? treeConvertGroup[groupId].groupId
        : treeConvertGroup[groupId].parentId;

    let selectObjChild = { ...selectObj };

    if (parentId !== "") {
      if (isChecked) {
        const listChild = treeConvertGroup[parentId].children;

        if (containsAllElements(selectObjChild, listChild)) {
          selectObjChild[parentId] = true;

          selectObjChild = handleCheckParent(
            isChecked,
            parentId,
            selectObjChild
          );
        }
      } else {
        selectObjChild[parentId] = false;

        selectObjChild = handleCheckParent(isChecked, parentId, selectObjChild);
      }
    }

    return selectObjChild;
  };

  const handleCheckItem = (e) => {
    let selectObj = { ...selectedList };

    if (e.target.checked) {
      selectObj[e.target.value] = true;
    } else {
      selectObj[e.target.value] = false;
    }

    selectObj = handleCheckChild(e.target.checked, e.target.value, selectObj);
    selectObj = handleCheckParent(e.target.checked, e.target.value, selectObj);

    setSelectedList(selectObj);
  };

  const handleChangeKeyword = (e) => {
    setKeyword(e.target.value);
  };

  return {
    data: dataGroupListFilterKeyword,
    selectedList,
    listDevice,

    handleCheckItem,
    handleChangeKeyword,
  };
};

export default useTreeGroupList;
