"use strict"
var a1=[];
var a2=[];
function fcpy(arr1, arr)
{
    arr1=[];
    for(var i=0;i<12;i++)
    {
        arr1[i]=[];
        for(var j=0;j<12;j++)
            arr1[i][j]=arr[i][j];
    }
    return arr1;
}

function f_delete_objonpath(arr, a1)
{
    var p, p1, q, q1, t, f;
    for(var i=0;i<arr.length-1;i++)
    {
        p=arr[i][0];
        q=arr[i][1];
        p1=arr[i+1][0];
        q1=arr[i+1][1];
        t=(p1-p)/Math.abs(p1-p);
        f=(q1-q)/Math.abs(q1-q);
        for(var m=p, n=q; m!=p1 && n!=q1; m=m+t, n=n+f)
        {
            if(a1[m][n]!=0) a1[m][n]=0;
        }
    }
    return a1;
}

function f_delete_single(arr)
{
    var arr1=[];
    for(var i=0;i<arr.length;i++)
    {
        if(arr[i].length>1)
            arr1.push(arr[i]);
    }
    return arr1;
}

function f_move_variants(p, q, player_num)
{
    var res=[];
    if(a2[p][q]%10==0)
    {
        for(var i=p+1, j=q+1; i<=top1 && j<=top1; i++, j++)
        {
            if(a2[i][j]==0)
                res[res.length]=[i,j];
            else
                break;
        }
        for(var i=p+1, j=q-1; i<=top1 && j>=floor1; i++, j--)
        {
            if(a2[i][j]==0)
                res[res.length]=[i,j];
            else
                break;
        }
        for(var i=p-1, j=q+1; i>=floor1 && j<=top1; i--, j++)
        {
            if(a2[i][j]==0)
                res[res.length]=[i,j];
            else
                break;
        }
        for(var i=p-1, j=q-1; i>=floor1 && j>=floor1; i--, j--)
        {
            if(a2[i][j]==0)
                res[res.length]=[i,j];
            else
                break;
        }
    }
    if(a2[p][q]==11)
    {
        if(a2[p-1][q+1]==0)
            res[res.length]=[p-1,q+1];
        if(a2[p-1][q-1]==0)
            res[res.length]=[p-1,q-1];
    }
    if(a2[p][q]==22)
    {
        if(a2[p+1][q+1]==0)
            res[res.length]=[p+1,q+1];
        if(a2[p+1][q-1]==0)
            res[res.length]=[p+1,q-1];
    }
    if(res.length==0)
        res=[[0,0]];
    return res;
}


function f_dattack_variants(p,q,player_num)
{
    var res=[];
    var enemy=0;
    for(var i=p+1,j=q+1; i<=top1 && j<=top1; i++, j++)
    {
        if(Math.floor(a1[i][j]/10)==(3-player_num))
            enemy++;
        if((a1[i][j]==0) && (enemy==1))
            res[res.length]=[i,j];
        if((Math.floor(a1[i][j]/10)==player_num) || (enemy==2))
            break; 
    }
    enemy=0;
    for(var i=p+1,j=q-1; i<=top1 && j>=floor1; i++, j--)
    {
        if(Math.floor(a1[i][j]/10)==(3-player_num))
            enemy++;
        if((a1[i][j]==0) && (enemy==1))
            res[res.length]=[i,j];
        if((Math.floor(a1[i][j]/10)==player_num) || (enemy==2))
            break;   
    }
    enemy=0;
    for(var i=p-1,j=q+1; i>=floor1 && j<=top1; i--, j++)
    {
        if(Math.floor(a1[i][j]/10)==(3-player_num))
            enemy++;
        if((a1[i][j]==0) && (enemy==1))
            res[res.length]=[i,j];
        if((Math.floor(a1[i][j]/10)==player_num) || (enemy==2))
            break;   
    }
    enemy=0;
    for(var i=p-1,j=q-1; i>=floor1 && j>=floor1; i--, j--)
    {
        if(Math.floor(a1[i][j]/10)==(3-player_num))
            enemy++;
        if((a1[i][j]==0) && (enemy==1))
            res[res.length]=[i,j];
        if((Math.floor(a1[i][j]/10)==player_num) || (enemy==2))
            break;   
    }
    if(res.length==0)
        res=[[0,0]];
    return res;
}

function cross_the_end(arr)
{

    for(var i=1;i<arr.length;i++)
    {
        if((a2[arr[0][0]][arr[0][1]]%10==1) && (arr[i][0]==floor1))
            return 1;
        if((a2[arr[0][0]][arr[0][1]]%10==2) && (arr[i][0]==top1))
            return 1;
    }
    return 0;
}


function f_attack_variants(p,q,player_num)
{
    var res=[];
    if((Math.floor(a1[p+1][q+1]/10)==(3-player_num)) && (a1[p+2][q+2]==0))
    {
        res[res.length]=[p+2, q+2];
    }
    if((Math.floor(a1[p+1][q-1]/10)==(3-player_num)) && (a1[p+2][q-2]==0))
    {
        res[res.length]=[p+2, q-2];
    }
    if((Math.floor(a1[p-1][q+1]/10)==(3-player_num)) && (a1[p-2][q+2]==0))
    {
        res[res.length]=[p-2, q+2];
    }
    if((Math.floor(a1[p-1][q-1]/10)==(3-player_num)) && (a1[p-2][q-2]==0))
    {
        res[res.length]=[p-2, q-2];
    }
    if(res.length==0)
        res=[[0,0]];
    return res;
}


function f_dattack_array(arr, player_num)
{
    var fmov=0;
    var pos=arr[arr.length-1];
    if(pos[0]==0)
        return [arr];
    var dtv;
    if((a2[arr[0][0]][arr[0][1]]%10==0) || (cross_the_end(arr)))
        dtv=f_dattack_variants(pos[0],pos[1], player_num);
    else
        dtv=f_attack_variants(pos[0],pos[1], player_num);
    if((dtv[0][0]==0) && (arr.length==1))
    {
        fmov=1;
        dtv=f_move_variants(pos[0],pos[1], player_num);
    }
    var res=[];
    for(var i=0;i<dtv.length;i++)
    {
        res[i]=arr.concat([dtv[i]]);
        if((fmov==1) && (dtv[0][0]!=0))
            res[i]=res[i].concat([[0,0]]);
    }
    return res;
}


function f_dattack_array_formation(p,q, player_num)
{
    var frm=[[[p,q]]];
    var res=[];
    var cont=0;
    var len=0;
    while(1)
    {
        res=[];
        cont=0;
        for(var i=0;i<frm.length;i++)
        {
            a1=fcpy(a1, a2);
            a1=f_delete_objonpath(frm[i], a1);
            res=res.concat(f_dattack_array(frm[i], player_num));
        }
        for(var i=0;i<res.length;i++)
        {
            len=res[i].length;
            if(!(res[i][len-1][0]==0))
                cont++;
        }
        if(cont==0)
            break;
        frm=[];
        for(var i=0;i<res.length;i++)
        {
            frm[i]=[];
            for(var j=0;j<res[i].length;j++)
            {
                frm[i][j]=[];
                for(var k=0;k<res[i][j].length;k++)
                    frm[i][j][k]=res[i][j][k];
            }
        }
    }
    for(var i=0;i<res.length;i++)
        res[i].length--;
    res=f_delete_single(res);
    return res;
}

function attack_only(arr)
{
    var res=[];
    var k=0;
    for(var i=0;i<arr.length;i++)
    {
        if(Math.abs(arr[i][0][0]-arr[i][1][0])==1)
            continue;
        else
        {
            res[k]=arr[i];
            k++;
        }
    }
    if(res.length==0)
        return arr;
    return res;
}


function checker_price(p,q,player_num)
{
    if((p<=5) && (player_num==1))
    {
        return 18-(p-3)*2;
    }
    if((p>5) && (player_num==1))
    {
        return 16-(p-3)*2;
    }
    if((p<=5) && (player_num==2))
    {
        return 6+(p-3)*2;
    }
    if((p>5) && (player_num==2))
    {
        return 8+(p-3)*2;
    }
}

function checker_move_price(p, q, p1, q1, player_num)
{
    var dp=p1-p;
    if(player_num==1)
    {
        return ((9-p)*0.5+Math.abs(dp*0.5)) * (-1) * (dp<0 ? (-1) : 1);
    }
    if(player_num==2)
    {
        return ((p-2)*0.5+Math.abs(dp*0.5)) * (dp>0 ? 1 : (-1));
    }
}

function f_score(player_num)
{
    var sc1=0;
    var sc2=0;
    for(var i=floor1; i<=top1;i++)
        for(var j=floor1;j<=top1;j++)
        {
            if(a[i][j]%10==player_num)
                sc1=sc1+checker_price(i,j,player_num);
            if(a[i][j]%10==(3-player_num))
                sc2=sc2+checker_price(i,j,3-player_num);
            if(a[i][j]/10==player_num)
                sc1=sc1+24;
            if(a[i][j]/10==(3-player_num))
                sc2=sc2+24;
        }
    return [sc1, sc2];
}

function f1_score(player_num)
{
    var sc=0;
    for(var i=floor1;i<=top1;i++)
    {
        for(var j=floor1;j<=top1;j++)
        {
            if(a2[i][j]%10==player_num)
            {
                sc=sc+checker_price(i,j,player_num);
                if((j==top1) || (j==floor1))
                    sc=sc+0.1;
            }
            if(a2[i][j]/10==player_num)
            {
                sc=sc+24;
                if((j==top1) || (j==floor1))
                    sc=sc+0.1;
            }
            if(a2[i][j]%10==(3-player_num))
            {
                sc=sc-checker_price(i,j,3-player_num);
                if((j==top1) || (j==floor1))
                    sc=sc-0.1;
            }
            if(a2[i][j]/10==(3-player_num))
            {
                sc=sc-24;
                if((j==top1) || (j==floor1))
                    sc=sc-0.1;
            }
        }
    }
    return sc;
}

function max_array1(arr, player_num, fextended, ind_or_max_and_arr) 
{
    var max_ind=0;
    var max=-1000;
    var cur_max=0;
    
    for(var i=0;i<arr.length;i++)
    {
        cur_max=0;
        a2[arr[i][arr[i].length-1][0]][arr[i][arr[i].length-1][1]]=a2[arr[i][0][0]][arr[i][0][1]];   // конечная точка пути равна начальной
        if(cross_the_end(arr[i]))
            a2[arr[i][arr[i].length-1][0]][arr[i][arr[i].length-1][1]]=player_num*10;
        a2[arr[i][0][0]][arr[i][0][1]]=0;
        a2=f_delete_objonpath(arr[i], a2);
        cur_max=cur_max+f1_score(player_num);

        var e_max=0;
        var e_max_arr=[];
        var e_max_ind=0;
        if(fextended)
        {
           // fextended--;
            var e_cur_max=0;
            var a3=[];
            a3=fcpy(a3, a2);
            var e_arr=possible_movements(3-player_num);
            for(var j=0;j<e_arr.length;j++)
            {
                e_cur_max=0;
                a2[e_arr[j][e_arr[j].length-1][0]][e_arr[j][e_arr[j].length-1][1]]=a2[e_arr[j][0][0]][e_arr[j][0][1]];   // конечная точка пути равна начальной
                if(cross_the_end(e_arr[j]))
                    a2[e_arr[j][e_arr[j].length-1][0]][e_arr[j][e_arr[j].length-1][1]]=(3-player_num)*10;
                a2[e_arr[j][0][0]][e_arr[j][0][1]]=0;
                a2=f_delete_objonpath(e_arr[j], a2);
                e_cur_max=e_cur_max+f1_score(3-player_num);
                if(e_cur_max>e_max)
                {
                    e_max=e_cur_max;
                    e_max_ind=j;
                }
                a2=fcpy(a2, a3);
            }
            if(e_arr.length!=0)
                e_max_arr=e_arr[e_max_ind];

        }


        if(e_max_arr.length!=0)
        {
            a2[e_max_arr[e_max_arr.length-1][0]][e_max_arr[e_max_arr.length-1][1]]=a2[e_max_arr[0][0]][e_max_arr[0][1]];   // конечная точка пути равна начальной
            if(cross_the_end(e_max_arr))
                a2[e_max_arr[e_max_arr.length-1][0]][e_max_arr[e_max_arr.length-1][1]]=(3-player_num)*10;
            a2[e_max_arr[0][0]][e_max_arr[0][1]]=0;
            a2=f_delete_objonpath(e_max_arr, a2);
            cur_max=cur_max-e_max;
        }


        var p_max=0;
        var p_max_arr;
        var p_max_ind=0;
        if(fextended)
        {
            var p_cur_max=0;
            var a3=[];
            a3=fcpy(a3, a2);
            var p_arr=possible_movements(3-player_num);
            for(var j=0;j<p_arr.length;j++)
            {
                p_cur_max=0;
                a2[p_arr[j][p_arr[j].length-1][0]][p_arr[j][p_arr[j].length-1][1]]=a2[p_arr[j][0][0]][p_arr[j][0][1]];   // конечная точка пути равна начальной
                if(cross_the_end(p_arr[j]))
                    a2[p_arr[j][p_arr[j].length-1][0]][p_arr[j][p_arr[j].length-1][1]]=player_num*10;
                a2[p_arr[j][0][0]][p_arr[j][0][1]]=0;
                a2=f_delete_objonpath(p_arr[j], a2);
                p_cur_max=p_cur_max+f1_score(player_num);
                if(p_cur_max>p_max)
                {
                    p_max=p_cur_max;
                    p_max_ind=j;
                }
                a2=fcpy(a2, a3);
            }
            if(p_arr.length!=0)
                p_max_arr=p_arr[p_max_ind];

        }
        cur_max=cur_max+p_max;


        e_max=0;
        e_max_arr=[];
        e_max_ind=0;
        if(fextended)
        {
           // fextended--;
            var e_cur_max=0;
            var a3=[];
            a3=fcpy(a3, a2);
            var e_arr=possible_movements(3-player_num);
            for(var j=0;j<e_arr.length;j++)
            {
                e_cur_max=0;
                a2[e_arr[j][e_arr[j].length-1][0]][e_arr[j][e_arr[j].length-1][1]]=a2[e_arr[j][0][0]][e_arr[j][0][1]];   // конечная точка пути равна начальной
                if(cross_the_end(e_arr[j]))
                    a2[e_arr[j][e_arr[j].length-1][0]][e_arr[j][e_arr[j].length-1][1]]=(3-player_num)*10;
                a2[e_arr[j][0][0]][e_arr[j][0][1]]=0;
                a2=f_delete_objonpath(e_arr[j], a2);
                e_cur_max=e_cur_max+f1_score(3-player_num);
                if(e_cur_max>e_max)
                {
                    e_max=e_cur_max;
                    e_max_ind=j;
                }
                a2=fcpy(a2, a3);
            }
            if(e_arr.length!=0)
                e_max_arr=e_arr[e_max_ind];

        }

        cur_max=cur_max-e_max;
        
        if(cur_max>max)
        {
            max=cur_max;
            max_ind=i;
        }
        a2=fcpy(a2, a);
    }
    return max_ind;
}

function max_array(arr, player_num, fextended, ind_or_max_and_arr)              //ind_or_max  если ноль ф-ция вернет макс. индекс, если один - макс рейтинг и путь
{
    var max_ind=0;
    var max=-1000;
    var cur_max=0;
    for(var i=0;i<arr.length;i++)
    {
        cur_max=0;
        a1=fcpy(a1,a2);
        for(var j=0;j<arr[i].length-1;j++)
        {
            cur_attack=0;
            var t=(arr[i][j+1][0]-arr[i][j][0])/Math.abs(arr[i][j+1][0]-arr[i][j][0]);
            var f=(arr[i][j+1][1]-arr[i][j][1])/Math.abs(arr[i][j+1][1]-arr[i][j][1]);
            for(var p=arr[i][j][0]+t, q=arr[i][j][1]+f; p!=arr[i][j+1][0] && q!=arr[i][j+1][1];p=p+t, q=q+f)
            {
                if(a1[p][q]%10==(3-player_num))
                {
                    cur_max=cur_max+checker_price(p,q, (3-player_num));
                    a1[p][q]=0;
                }
                if(a1[p][q]/10==(3-player_num))
                {
                    cur_max=cur_max+24; 
                    a1[p][q]=0;
                }
            }
        }
        var len=arr[i].length;
        if((arr[i][len-1][0]==top1) || (arr[i][len-1][1]==top1) || (arr[i][len-1][0]==floor1) || (arr[i][len-1][1]==floor1))
            cur_max=cur_max+0.1;
        if(a1[arr[i][0][0]][arr[i][0][1]]%10==player_num)
        {
            cur_max=cur_max+checker_move_price(arr[i][0][0], arr[i][0][1], arr[i][arr[i].length-1][0], arr[i][arr[i].length-1][1], player_num);
        }
        if(fextended)
        {
            a2=fcpy(a2,a);
            a2[arr[i][arr[i].length-1][0]][arr[i][arr[i].length-1][1]]=a2[arr[i][0][0]][arr[i][0][1]];
            if(cross_the_end(arr[i]))
                a2[arr[i][arr[i].length-1][0]][arr[i][arr[i].length-1][1]]-=player_num;
            a2[arr[i][0][0]][arr[i][0][1]]=0;
            a2=f_delete_objonpath(arr[i], a2);
            var ind_and_arr=[];
            var e_arr=possible_movements(3-player_num);
            var ind_and_arr=max_array(e_arr, 3-player_num, fextended-1, 1);
            var e_max=ind_and_arr[0];
            var e_arr_max=ind_and_arr[1];



            var p_max=0;
            if(e_arr_max)
            {
                a2[e_arr_max[e_arr_max.length-1][0]][e_arr_max[e_arr_max.length-1][1]]=a2[e_arr_max[0][0]][e_arr_max[0][1]];
                if(cross_the_end(e_arr_max))
                    a2[e_arr_max[e_arr_max.length-1][0]][e_arr_max[e_arr_max.length-1][1]]-=(3-player_num);
                a2[e_arr_max[0][0]][e_arr_max[0][1]]=0;
                a2=f_delete_objonpath(e_arr_max, a2);
                var p_arr=possible_movements(player_num);
                ind_and_arr=max_array(p_arr, player_num, fextended-1, 1);
                p_max=ind_and_arr[0];
            }
            cur_max=cur_max-e_max/3;
            var sc=[];
            sc=f_score(player_num);
            if(sc[0]/sc[1]>=1.7)
                cur_max=cur_max+p_max/2;
            else
                cur_max=cur_max+p_max/10;
            a2=fcpy(a2,a);
        }
        if(cur_max>max)
        {
            max=cur_max;
            max_ind=i;
        }
    }
    if(ind_or_max_and_arr==0)
        return max_ind;
    if(ind_or_max_and_arr==1)
        return [max, arr[max_ind]];
}

function possible_movements(player_num)
{
    var arr=[];
    var m,n;
    for(var i=floor1;i<=top1;i++)
        for(var j=floor1;j<=top1;j++)
            if(Math.floor(a2[i][j]/10)==player_num)
            {
                m=i;
                n=j;
                arr=arr.concat(f_dattack_array_formation(m,n, player_num));
            }
    arr=attack_only(arr);
    return arr;
}

function f_cpu()
{
    var arr=[];
    a2=fcpy(a2,a);
    arr=possible_movements(player_num);
    var max_ind=max_array(arr, player_num, 1, 0);
    cpu_route=arr[max_ind];
}

