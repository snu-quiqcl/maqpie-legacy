import { useEffect, useState } from 'react';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

interface TreeNode {
  id: string;
  name: string;
  isExperiment: boolean;
  parent: TreeNode | null;
  children?: TreeNode[] | null;
}

function getTreePath(node: TreeNode) {
  const path: string[] = [];
  while (node.parent) {
    path.unshift(node.name);
    node = node.parent;
  }
  return path.join('/');
}

export default function Explorer() {
  const [tree, setTree] = useState<TreeNode[]>([]);
  const rootNode: TreeNode = {
    id: '.',
    name: '',
    isExperiment: false,
    parent: null,
  };

  useEffect(() => {
    fetchRoot();
  }, []);

  const makeSubTree = (data: string[], parent: TreeNode) => {
    const filteredData = data.filter((name: string) => (
      !name.startsWith('_') && (name.endsWith('/') || name.endsWith('.py'))
    ));

    return filteredData.map((name: string) => {
      const isExperiment = name.endsWith('.py');
      const children = isExperiment ? null : undefined;
      return {
        id: `${getTreePath(parent)}/${name}`,
        name: name,
        isExperiment: isExperiment,
        parent: parent,
        children: children,
      };
    });
  };

  const fetchRoot = async () => {
    const url = new URL('/ls/', window.location.origin);
    url.searchParams.set('directory', '.');

    const res = await fetch(url.toString(), {
      method: 'GET',
    });
    const data = await res.json();
    
    setTree(makeSubTree(data, rootNode));
  };

  const renderTree = (nodes: TreeNode[]) =>
    nodes.map((node) => (
      <TreeItem
        key={node.id}
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
