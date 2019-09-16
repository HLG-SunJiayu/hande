import { getModuleRouters } from 'utils/utils';
import { getRouterData as getDefaultRouters } from 'utils/router';
import * as hzeroFrontHagdRouters from 'hzero-front-hagd/lib/utils/router';
import * as hzeroFrontHcnfRouters from 'hzero-front-hcnf/lib/utils/router';
import * as hzeroFrontHdttRouters from 'hzero-front-hdtt/lib/utils/router';
import * as hzeroFrontHfileRouters from 'hzero-front-hfile/lib/utils/router';
import * as hzeroFrontHiamRouters from 'hzero-front-hiam/lib/utils/router';
import * as hzeroFrontHimpRouters from 'hzero-front-himp/lib/utils/router';
import * as hzeroFrontHitfRouters from 'hzero-front-hitf/lib/utils/router';
import * as hzeroFrontHmsgRouters from 'hzero-front-hmsg/lib/utils/router';
import * as hzeroFrontHpfmRouters from 'hzero-front-hpfm/lib/utils/router';
import * as hzeroFrontHptlRouters from 'hzero-front-hptl/lib/utils/router';
import * as hzeroFrontHrptRouters from 'hzero-front-hrpt/lib/utils/router';
import * as hzeroFrontHsdrRouters from 'hzero-front-hsdr/lib/utils/router';
import * as hzeroFrontHsgpRouters from 'hzero-front-hsgp/lib/utils/router';
import * as hzeroFrontHwflRouters from 'hzero-front-hwfl/lib/utils/router';
import * as hzeroFrontHwfpRouters from 'hzero-front-hwfp/lib/utils/router';
import * as srmFrontSbidRouters from 'srm-front-sbid/lib/utils/router';
import * as srmFrontSeciRouters from 'srm-front-seci/lib/utils/router';
import * as srmFrontSfinRouters from 'srm-front-sfin/lib/utils/router';
import * as srmFrontSinvRouters from 'srm-front-sinv/lib/utils/router';
import * as srmFrontSmdmRouters from 'srm-front-smdm/lib/utils/router';
import * as srmFrontSodrRouters from 'srm-front-sodr/lib/utils/router';
import * as srmFrontSpfmRouters from 'srm-front-spfm/lib/utils/router';
import * as srmFrontSprmRouters from 'srm-front-sprm/lib/utils/router';
import * as srmFrontSqamRouters from 'srm-front-sqam/lib/utils/router';
import * as srmFrontSslmRouters from 'srm-front-sslm/lib/utils/router';
import * as srmFrontSsrcRouters from 'srm-front-ssrc/lib/utils/router';
import * as srmFrontSpcmRouters from 'srm-front-spcm/lib/utils/router';
// import * as srmFrontMallRouters from 'srm-front-mall/lib/utils/router';
import * as srmFrontScecRouters from 'srm-front-scec/lib/utils/router';
import * as srmFrontSitfRouters from 'srm-front-sitf/lib/utils/router';
import * as srmFrontHiamRouters from 'srm-front-hiam/lib/utils/router'; // 覆盖子账户管理路由
import * as srmFrontSwflRouters from 'srm-front-swfl/lib/utils/router';
import * as srmFrontHipsRouters from 'srm-front-hips/lib/utils/router';

export default app =>
  getModuleRouters(app, [
    getDefaultRouters,
    hzeroFrontHagdRouters,
    hzeroFrontHcnfRouters,
    hzeroFrontHdttRouters,
    hzeroFrontHfileRouters,
    hzeroFrontHiamRouters,
    hzeroFrontHimpRouters,
    hzeroFrontHitfRouters,
    hzeroFrontHmsgRouters,
    hzeroFrontHpfmRouters,
    hzeroFrontHptlRouters,
    hzeroFrontHrptRouters,
    hzeroFrontHsdrRouters,
    hzeroFrontHsgpRouters,
    hzeroFrontHwflRouters,
    hzeroFrontHwfpRouters,
    srmFrontSbidRouters,
    srmFrontSeciRouters,
    srmFrontSfinRouters,
    srmFrontSinvRouters,
    srmFrontSmdmRouters,
    srmFrontSodrRouters,
    srmFrontSpfmRouters,
    srmFrontSprmRouters,
    srmFrontSqamRouters,
    srmFrontSslmRouters,
    srmFrontSsrcRouters,
    srmFrontSpcmRouters,
    // srmFrontMallRouters,
    srmFrontSitfRouters,
    srmFrontScecRouters,
    srmFrontHiamRouters,
    srmFrontSwflRouters,
    srmFrontHipsRouters
  ]);
