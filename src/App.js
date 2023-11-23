import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import { getTreeGroupDevice } from "./data";
import useTreeGroupList from "./useTreeGroupList";
import { Checkbox, Typography } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    height: 110,
    flexGrow: 1,
    maxWidth: 400,
  },
});

const TreeViewCustom = ({ name, value, handleCheckItem }) => {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Typography>{name}</Typography>
      <Checkbox onChange={handleCheckItem} value={value} />
    </label>
  );
};

function App() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState([]);

  const { data, selectedList, handleCheckItem } = useTreeGroupList(
    getTreeGroupDevice.data
  );

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
            value={nodes.id}
            name={nodes.name}
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

  console.log("================================", selectedList);

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
}

export default App;
