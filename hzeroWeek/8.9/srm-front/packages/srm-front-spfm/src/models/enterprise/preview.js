import { getResponse } from 'utils/utils';
import { fetchEnterpriseInfo } from '@/services/enterpriseService';

export default {
  namespace: 'approvalPreview',

  state: {
    previewDetail: {},
  },

  effects: {
    *fetchPreviewDetail({ payload }, { put, call }) {
      const res = getResponse(yield call(fetchEnterpriseInfo, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            previewDetail: res,
          },
        });
      }
    },
  },

  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
