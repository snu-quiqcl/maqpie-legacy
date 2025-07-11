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

const rootNode: TreeNode = {
  id: './',
  name: '',
  isExperiment: false,
  parent: null,
};

const makeSubTree = (data: string[], parent: TreeNode): TreeNode[] => {
  const filteredData = data.filter((name: string) => (
    !name.startsWith('_') && (name.endsWith('/') || name.endsWith('.py'))
  ));

  return filteredData.map((name: string) => {
    const isExperiment = name.endsWith('.py');
    const children = isExperiment ? null : undefined;
    return {
      id: `${parent.id}${name}`,
      name: name,
      isExperiment: isExperiment,
      parent: parent,
      children: children,
    };
  });
};

export default function Explorer() {
  const [tree, setTree] = useState<TreeNode[]>([]);

  useEffect(() => {
    initTree();
  }, []);

  const findNode = (id: string, nodes: TreeNode[] = tree): TreeNode | null => {
    for (const node of nodes) {
      if (node.id === id) {
        return node;
      }

      if (node.children) {
        const child = findNode(id, node.children);
        if (child) {
          return child;
        }
      }
    }
    
    return null;
  };

  const fetchChildren = async (parentId: string): Promise<string[]> => {
    const url = new URL('/ls/', window.location.origin);
    url.searchParams.set('directory', parentId);

    const res = await fetch(url.toString(), {
      method: 'GET',
    });
    const data = await res.json();

    return data;
  };

  const initTree = async () => {
    const data = await fetchChildren(rootNode.id);
    
    setTree(makeSubTree(data, rootNode));
  };

  const loadChildren = async (parentId: string) => {
    const data = await fetchChildren(parentId);

    const parent = findNode(parentId);
    if (parent) {
      parent.children = makeSubTree(data, parent);
    }

    setTree([...tree]);
  }

  const handleNodeClick = (id: string) => {
    const node = findNode(id);
    console.log(node);
    if (node && node.children == undefined) {
      loadChildren(id);
    }
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
    <SimpleTreeView
      onItemClick={(_, itemId) => handleNodeClick(itemId)}
    >
      {renderTree(tree)}
    </SimpleTreeView>
  );
}
