import SearchTabForMobile from '../Project/SearchTabForMobile';
import type { Meta, StoryObj } from '@storybook/react';
import { FilterState } from './ProjectFilter.stories';
import { Classification } from '../Project/Filter';

const meta: Meta<typeof SearchTabForMobile> = {
  component: SearchTabForMobile,
};

export default meta;
type Story = StoryObj<typeof SearchTabForMobile>;

const filterState: FilterState = {
  availableFilters: [
    'large-scale-planting',
    'agroforestry',
    'natural-regeneration',
    'managed-regeneration',
    'urban-planting',
    'other-planting',
  ],
  filterApplied: 'large-scale-planting',
};

const setFilterApplied = (value: Classification | undefined) => {
  window.alert(`${value} is selected`);
};

export const Default: Story = {
  args: {
    numberOfProject: 56,
    filterApplied: filterState.filterApplied,
    setFilterApplied: setFilterApplied,
    availableFilters: filterState.availableFilters,
  },
};
