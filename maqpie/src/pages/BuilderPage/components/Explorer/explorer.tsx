import { useState } from 'react';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
}

export default function Explorer() {
  const [tree, setTree] = useState<TreeNode[]>([]);

  const renderTree = (nodes: TreeNode[]) =>
    nodes.map((node) => (
      <TreeItem
        itemId={node.id}
        label={node.name}
      >
        {node.children ? renderTree(node.children) : null}
      </TreeItem>
    ));

  return (
    <SimpleTreeView>
      {renderTree(tree)}
    </SimpleTreeView>
  );
}
