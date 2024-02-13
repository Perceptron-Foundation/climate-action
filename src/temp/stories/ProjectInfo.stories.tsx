import type { Meta, StoryObj } from '@storybook/react';
import InfoContainer from '../ProjectInfo/InfoContainer';

const meta: Meta<typeof InfoContainer> = {
  component: InfoContainer,
};

export default meta;
type Story = StoryObj<typeof InfoContainer>;

const seasons = [6, 7, 8, 9, 10, 11, 12, 3, 4];

export const Preview: Story = {
  args: {
    abandonment: 2005,
    firstTree: '2015-03-08 00:00:00',
    plantingDensity: 500,
    maxPlantingDensity: 10000,
    employees: 500,
    plantingSeasons: seasons,
  },
};
