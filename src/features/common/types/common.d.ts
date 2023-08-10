import { Dispatch, SetStateAction } from 'react';

export type SetState<T> = Dispatch<SetStateAction<T>>;

/**
 * Date string with the following formats
 *  `YYYY-MM-DD hh:mm:ss` or `YYYY-MM-DDTHH:mm:ss.sssZ` or `YYYY-MM-DD hh:mm:ss.sssZ`
 * i.e. ISO 8601 extended format */
export type DateString = string;
