import {
  Box,
  Checkbox,
  Popover,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import React, { useMemo } from "react";
import useTreeGroupList from "../useTreeGroupList";
import { getTreeGroupDevice } from "../data";
import { TreeItem, TreeView } from "@material-ui/lab";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

const TreeGroupDeviceSelect = () => {
  const {
    data,
    selectedList,
    listDevice,
    handleCheckItem,
    handleChangeKeyword,
  } = useTreeGroupList(getTreeGroupDevice.data);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const getDeviceListSelected = useMemo(() => {
    return Object.keys(selectedList).filter(
      (key) => listDevice.includes(key) && selectedList[key]
    );
  }, [listDevice, selectedList]);

  const getTextSelected = useMemo(() => {
    if (getDeviceListSelected.length === listDevice.length) {
      return "All devices";
    } else if (getDeviceListSelected.length > 0) {
      return `${getDeviceListSelected.length} selected devices`;
    } else {
      return "All devices";
    }
  }, [getDeviceListSelected, listDevice]);

  return (
    <Box
      style={{
        width: "300px",
        minWidth: "300px",
      }}
    >
      <Box
        onClick={handleClick}
        style={{
          border: "1px solid #d3d3d3",
          cursor: "pointer",
          display: "flex",
          padding: "11px 11px 11px 22px",
          fontSize: "14px",
          borderRadius: "4px",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>{getTextSelected}</span>
      </Box>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Box style={{ padding: "10px" }}>
          <TextField
            size="small"
            variant="outlined"
            onChange={handleChangeKeyword}
          />
          <Box
            style={{
              maxHeight: "auto",
              minHeight: "420px",
            }}
          >
            <TreeViewPopUp
              data={data}
              selectedList={selectedList}
              handleCheckItem={handleCheckItem}
            />
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};

const useStyles = makeStyles({
  root: {
    height: 110,
    flexGrow: 1,
    maxWidth: 400,
  },
});

const TreeViewPopUp = ({ data, selectedList, handleCheckItem }) => {
  const classes = useStyles();

  const [expanded, setExpanded] = React.useState([data.id]);

  const handleToggle = (event, nodeIds) => {
    if (event.target.nodeName !== "svg") {
      return;
    }
    setExpanded(nodeIds);
  };

  const renderTree = (nodes) => {
    return (
      <TreeItem
        key={nodes.id}
        nodeId={nodes.id}
        label={
          <TreeViewCustom
            value={nodes}
            isChecked={selectedList[nodes.id] ?? false}
            handleCheckItem={handleCheckItem}
          />
        }
      >
        {Array.isArray(nodes.children)
          ? nodes.children.map((node) => renderTree(node))
          : null}
      </TreeItem>
    );
  };

  return (
    <>
      {data && (
        <TreeView
          className={classes.root}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpanded={[data.id]}
          defaultExpandIcon={<ChevronRightIcon />}
          disableSelection={true}
          expanded={expanded}
          onNodeToggle={handleToggle}
        >
          {renderTree(data)}
        </TreeView>
      )}
    </>
  );
};

const TreeViewCustom = ({ value, handleCheckItem, isChecked }) => {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Typography>{value.name}</Typography>
      <Checkbox
        onChange={handleCheckItem}
        value={value.id}
        checked={isChecked}
      />
    </label>
  );
};

export default TreeGroupDeviceSelect;
