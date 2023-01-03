import { compact } from 'lodash';

export function extractTemplateKeys(template: string) {
    const rx = /\%\(.*\)[b,c,d,i,e,u,f,g,o,s,t,T,v,x,X,j]/;
    const names = template.split('%(')
            .map(it => it.split('%('))
            .map(it => `%(${it}`)
            .filter(it => rx.test(it));

    return compact(names.map(it => it.replace(/(.*\%\()|(\)[b,c,d,i,e,u,f,g,o,s,t,T,v,x,X,j].*)/ig, '')));
}
