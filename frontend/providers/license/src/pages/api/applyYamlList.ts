import { authSession } from '@/services/backend/auth';
import { getK8s } from '@/services/backend/kubernetes';
import { jsonRes } from '@/services/backend/response';
import { ApiResp } from '@/services/kubernet';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResp>) {
  const { yamlList, type = 'create' } = req.body as {
    yamlList: string[];
    type?: 'create' | 'replace' | 'update';
  };

  if (!yamlList) {
    jsonRes(res, {
      code: 500,
      error: 'params error'
    });
    return;
  }

  try {
    const { applyYamlList } = await getK8s({
      kubeconfig: await authSession(req)
    });

    await applyYamlList(yamlList, type);

    jsonRes(res);
  } catch (err: any) {
    console.log(err, '------');
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
