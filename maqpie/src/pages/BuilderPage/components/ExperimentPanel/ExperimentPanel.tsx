import type { Experiment } from '../../../../store/slices/experiment/experiment';

type ExperimentPanelProps = {
  experiment: Experiment;
};

export default function ExperimentPanel({ experiment }: ExperimentPanelProps) {
  return <div>ExperimentPanel</div>;
}
