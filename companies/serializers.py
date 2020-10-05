from rest_framework import serializers

from .models import Area, Company, Department, Post
from ordov.choices import DEGREE_CHOICES

class AreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = (
            'name',
            'description',
            )
class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = (
            'name',
            'short_name',
            'description',
            'scale',

            'area',
            'c_type',
            )

class DepartmentSerializer(serializers.ModelSerializer):

    company = CompanySerializer(required=True)

    class Meta:
        model = Department
        fields = (
            'company', # foreignkey
            'name',
            'description',
        )

    def create(self, validated_data):
        company_data = validated_data.pop('company')

        company = CompanySerializer.create(CompanySerializer(), validated_data=company_data)

        department, created = Department.objects.update_or_create(
            company=company,
            **validated_data)

        return department

class PostSerializer(serializers.ModelSerializer):
    department = DepartmentSerializer(required=True)
    id = serializers.SerializerMethodField()
    place = serializers.SerializerMethodField()
    link = serializers.SerializerMethodField()
    request = serializers.SerializerMethodField()
    question = serializers.SerializerMethodField()

    def get_question(self, post):
        return post.question
    def get_id(self, post):
        return post.id
    def get_place(self, post):
        try:
            return post.address_province + post.address_city + post.address_district
        except TypeError:
            return "未填写"

    def get_yaoqiu(self, post):
        return post.yaoqiu

    def get_link(self, post):
        try:
            if post.linkman == "" and post.linkman_phone == "":
                return "未填写"
            return post.linkman + "(" + post.linkman_phone + ")"
        except TypeError:
            return "未填写"

    def get_request(self, post):
        degree_min = 0
        degree_max = post.degree_max
        if not degree_max:
            degree_max = 0
        if degree_max > 9:
            degree_max = 9
        if degree_min < 1:
            degree_min = 1
        return "年龄[" + str(post.age_min) + "," + str(post.age_max) + "] " + \
            "学历[" + DEGREE_CHOICES[degree_min][1] + "," + DEGREE_CHOICES[degree_max][1]+"] " + \
            "毕业时间[" + str(post.graduatetime_min) + "," + str(post.graduatetime_max) + "]"

    class Meta:
        model = Post
        fields = (
            'id',
            'department',

            'name',
            'project_name',
            'description',
            'baiying_task_name',
            'question',
            'place',
            'link',
            'request',
            'yaoqiu',

            'talk_hint',
            'prologue',
            'workplace',
            'work_purpose',
            'wechat_invite',

            'yaoyuemuban',
            'mianshimuban',
            'offermuban',

            'finished',
            'address_province',
            'address_city',
            'address_district',
            'address_street',
            'address_suite',
            'extra_address',

            # 多返回字段
            'keywords'
        )

    def create(self, validated_data):
        department_data = validated_data.pop('department')

        department_ = DepartmentSerializer.create(DepartmentSerializer(), validated_data=department_data)
        company_ = department_.company

        post, created = Post.objects.update_or_create(
            company=company_,
            department=department_,
            **validated_data)

        return post
